import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FoodAnalysis {
  name: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  classification: 'healthy' | 'moderate' | 'unrecommended';
  canIEat: {
    answer: 'sim' | 'não';
    explanation: string;
  };
  alternatives: string[];
}

const getAIResponse = async (params: any) => {
  try {
    const response = await ai.models.generateContent(params);
    return response;
  } catch (error: any) {
    if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('API_KEY_INVALID')) {
      console.error("Erro de API Key. Por favor, verifique as configurações no painel Secrets.");
    }
    throw error;
  }
};

export async function analyzeFood(imageUri: string): Promise<FoodAnalysis> {
  const matches = imageUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Formato de imagem inválido");
  
  const mimeType = matches[1];
  const base64Data = matches[2];

  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: "Analise esta imagem de comida. Forneça: Nome, Calorias (por 100g), Macronutrientes, Classificação (saudável, moderada, não recomendada), se pode comer (sim/não) com explicação e 3 alternativas mais saudáveis. Responda em Português." }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fats: { type: Type.STRING }
              },
              required: ["protein", "carbs", "fats"]
            },
            classification: { type: Type.STRING, enum: ["healthy", "moderate", "unrecommended"] },
            canIEat: {
              type: Type.OBJECT,
              properties: {
                answer: { type: Type.STRING, enum: ["sim", "não"] },
                explanation: { type: Type.STRING }
              },
              required: ["answer", "explanation"]
            },
            alternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "calories", "macros", "classification", "canIEat", "alternatives"]
        }
      }
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error("AI Scan failed:", error);
    throw error;
  }
}

export async function chatLeanAI(message: string, userData: any, history: any[] = []) {
  try {
    const systemPrompt = `Você é o "Lean AI", um assistente de saúde e bem-estar amigável, motivador e altamente técnico em nutrição. 
      Dados do usuário: Peso: ${userData.weight}kg, Altura: ${userData.height}cm, Objetivo: ${userData.goal || 'Saúde geral'}.
      Responda de forma humana, clara e baseada nos dados do usuário. Foque em dieta, treino e saúde. 
      Mantenha as respostas concisas e práticas. Use emojis com moderação.`;

    const processedHistory = history
      .filter((h, i) => !(i === 0 && h.role === 'model'))
      .map(h => ({
        role: h.role === 'user' ? 'user' : ('model' as any),
        parts: [{ text: h.text }]
      }));

    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `Contexto do Usuário: Peso ${userData.weight}kg, Altura ${userData.height}cm, Objetivo ${userData.goal || 'Saúde'}.` }] },
        { role: 'model', parts: [{ text: 'Entendido. Como sua Nutricionista IA, estou pronta para ajudar com base no seu perfil. Em que posso ser útil agora?' }] },
        ...processedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: { systemInstruction: systemPrompt }
    });

    return result.text || "";
  } catch (error) {
    console.error("Chat failed:", error);
    return "Desculpe, tive um problema ao processar sua mensagem. Verifique sua conexão.";
  }
}

export async function generateRecipes(query: string) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Gere 3 receitas saudáveis baseadas na busca: "${query}". 
      Para cada receita inclua: nome (campo 'nome'), calorias (campo 'calorias'), explicacao (uma breve descrição atrativa, campo 'explicacao'), tempo de preparo (ex: 20min), categoria (Café, Almoço, Jantar ou Lanche), 2 tags curtas (ex: Low Carb, Proteína), ingredientes (campo 'ingredientes' como array) e modo de preparo (campo 'modo_preparo' como string ou array). 
      Responda em Português.` }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              calorias: { type: Type.NUMBER },
              explicacao: { type: Type.STRING },
              time: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Café", "Almoço", "Jantar", "Lanche"] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              ingredientes: { type: Type.ARRAY, items: { type: Type.STRING } },
              modo_preparo: { type: Type.STRING }
            },
            required: ["nome", "calorias", "explicacao", "time", "category", "tags", "ingredientes", "modo_preparo"]
          }
        }
      }
    });

    const results = JSON.parse(result.text);
    return results.map((r: any, i: number) => ({
      ...r,
      id: `ai-${Date.now()}-${i}`
    }));
  } catch (error) {
    console.error("Recipe generation failed:", error);
    return [];
  }
}

export async function generateDietPlan(userData: any) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Crie um plano alimentar diário personalizado (Café da Manhã, Almoço, Jantar e Lanches).
      Perfil: Peso ${userData.weight}kg, Altura ${userData.height}cm, Preferências: ${userData.preferences?.join(', ') || 'Nenhuma'}. Responda em Português.` }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              meal: { type: Type.STRING },
              plate: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              benefits: { type: Type.STRING }
            },
            required: ["meal", "plate", "calories", "benefits"]
          }
        }
      }
    });
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Diet plan failed:", error);
    return [];
  }
}

export async function generateFridgeRecipes(ingredients: string[]) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Gere receitas baseadas nos ingredientes: ${ingredients.join(', ')}. Responda em Português JSON.` }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              tipo: { type: Type.STRING },
              calorias: { type: Type.NUMBER },
              explicacao: { type: Type.STRING },
              time: { type: Type.STRING },
              category: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              ingredientes: { type: Type.ARRAY, items: { type: Type.STRING } },
              modo_preparo: { type: Type.STRING }
            },
            required: ["nome", "tipo", "calorias", "explicacao", "time", "category", "tags", "ingredientes", "modo_preparo"]
          }
        }
      }
    });
    const results = JSON.parse(result.text);
    return results.map((r: any, i: number) => ({
      ...r,
      id: `fridge-${Date.now()}-${i}`
    }));
  } catch (error) {
    console.error("Fridge recipes failed:", error);
    return [];
  }
}

export async function generateWorkouts(query: string, time?: number) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Gere um treino de ${time || 20} minutos focado em: "${query}". Para cada exercício, inclua obrigatoriamente um emoji específico que represente fielmente o movimento (ex: 🤸 para polichinelo, 💪 para flexão, 🏋️ para agachamento, 🏃 para corrida, 🧘 para prancha). É PROIBIDO o uso de sparkles (✨). Use apenas emojis esportivos que correspondam à ação do exercício. Responda em Português.` }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  tutorial: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  emoji: { type: Type.STRING }
                },
                required: ["name", "tutorial", "duration", "emoji"]
              }
            }
          },
          required: ["title", "exercises"]
        }
      }
    });
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Workout generation failed:", error);
    return null;
  }
}

export async function generateDailyMotivation() {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: "Gere uma frase de motivação curta e inspiradora (máximo 100 caracteres) em Português focada em saúde, dieta ou exercícios. Não use emojis." }]}],
    });
    return (result.text || "").trim();
  } catch (error) {
    console.error("Motivation generation failed:", error);
    return "Cuidar de si é o melhor investimento! 💚";
  }
}

export async function generateShoppingList(goal: string, currentItems: string[]) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Gere uma lista de compras para o objetivo "${goal}". Evite o que já tem: ${currentItems.join(', ')}. Responda JSON array de strings.` }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Shopping list generation failed:", error);
    return ["Alface", "Tomate", "Frango", "Ovos", "Brócolis"];
  }
}

export async function generateFullDiet(profile: any, dietType: string) {
  try {
    const prompt = `Gere um plano alimentar diário COMPLETO (Café da manhã, Lanche da manhã, Almoço, Lanche da tarde e Jantar) focado em: ${dietType}. 
    Importante: Mantenha rigorosa fidelidade ao objetivo da dieta. Use emojis que combinem com os alimentos.
    Perfil: ${profile.weight}kg, ${profile.height}m. Responda JSON array de objetos.`;
    
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              nome: { type: Type.STRING },
              amount: { type: Type.STRING },
              calorias: { type: Type.NUMBER },
              benefit: { type: Type.STRING },
              ingredientes: { type: Type.ARRAY, items: { type: Type.STRING } },
              modo_preparo: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["type", "nome", "amount", "calorias", "benefit", "ingredientes", "modo_preparo"]
          }
        }
      }
    });
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Full diet generation failed:", error);
    throw error;
  }
}

export async function swapMeal(currentMeal: any, dietType: string) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Sugira uma troca saudável para ${currentMeal.nome}. Dieta: ${dietType}. Responda JSON.` }]}],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            nome: { type: Type.STRING },
            amount: { type: Type.STRING },
            calorias: { type: Type.NUMBER },
            benefit: { type: Type.STRING },
            ingredientes: { type: Type.ARRAY, items: { type: Type.STRING } },
            modo_preparo: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["type", "nome", "amount", "calorias", "benefit", "ingredientes", "modo_preparo"]
        }
      }
    });
    return JSON.parse(result.text);
  } catch (error) {
    console.error("Meal swap failed:", error);
    return currentMeal;
  }
}

export async function generateDietSuggestion(profile: any) {
  try {
    const result = await getAIResponse({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Dê uma dica nutricional curta para objetivo ${profile.goal}. Máximo 80 caracteres. Responda em Português.` }]}],
    });
    return result.text || "💡 Mantenha o foco!";
  } catch (error) {
    return "💡 Mantenha o foco: beber água ajuda a controlar o apetite!";
  }
}


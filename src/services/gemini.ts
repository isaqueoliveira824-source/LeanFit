import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

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

export async function analyzeFood(imageUri: string): Promise<FoodAnalysis> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageUri.split(',')[1]
          }
        },
        {
          text: "Analise esta imagem de comida. Forneça: Nome, Calorias (por 100g), Macronutrientes, Classificação (saudável, moderada, não recomendada), se pode comer (sim/não) com explicação e 3 alternativas mais saudáveis. Responda em Português."
        }
      ],
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
            alternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "calories", "macros", "classification", "canIEat", "alternatives"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Scan failed:", error);
    throw error;
  }
}

export async function chatLeanAI(message: string, userData: any, history: any[] = []) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Você é o Lean AI, um assistente de saúde e bem-estar amigável e motivador. 
        Dados do usuário: Peso: ${userData.weight}kg, Altura: ${userData.height}cm, Objetivo: ${userData.goal || 'Saúde geral'}.
        Responda de forma humana, clara e baseada nos dados do usuário. Foque em dieta, treino e saúde.`,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Chat failed:", error);
    return "Desculpe, tive um problema ao processar sua mensagem. Poderia repetir?";
  }
}

export async function generateRecipes(query: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere 3 receitas saudáveis baseadas na busca: "${query}". 
      Para cada receita inclua: nome (campo 'nome'), calorias (campo 'calorias'), explicacao (uma breve descrição atrativa, campo 'explicacao'), tempo de preparo (ex: 20min), categoria (Café, Almoço, Jantar ou Lanche), 2 tags curtas (ex: Low Carb, Proteína), ingredientes (campo 'ingredientes' como array) e modo de preparo (campo 'modo_preparo' como string ou array). 
      Responda em Português.`,
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
    const results = JSON.parse(response.text);
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
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie um plano alimentar diário personalizado (Café da Manhã, Almoço, Jantar e Lanches).
      Perfil: Peso ${userData.weight}kg, Altura ${userData.height}cm, Preferências: ${userData.preferences?.join(', ') || 'Nenhuma'}. Responda em Português.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              meal: { type: Type.STRING, description: "Tipo da refeição (ex: Café da Manhã)" },
              plate: { type: Type.STRING, description: "Nome do prato" },
              calories: { type: Type.NUMBER },
              benefits: { type: Type.STRING }
            },
            required: ["meal", "plate", "calories", "benefits"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Diet plan failed:", error);
    return [];
  }
}

export async function generateFridgeRecipes(ingredients: string[]) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um nutricionista inteligente e especialista em receitas saudáveis.
O usuário informou os seguintes ingredientes disponíveis na geladeira: ${ingredients.join(', ')}

Sua missão é gerar de 3 a 5 receitas BASEADAS nesses ingredientes de forma rigorosa.

REGRAS OBRIGATÓRIAS:
- Priorize receitas que usem APENAS os ingredientes informados (RECEITAS PERFEITAS)
- Se necessário, permita no máximo 1 ingrediente extra simples (ex: sal, açúcar, aveia, mel, azeite, pimenta, água) (RECEITAS QUASE PERFEITAS)
- NÃO gere receitas com ingredientes principais (carne, legumes, massas) que não estão na lista
- NÃO ignore os ingredientes do usuário
- Se não for de fato possível criar receitas saudáveis com o que existe, retorne um array vazio.

Para cada receita inclua: 
- nome: Nome da receita
- tipo: Exatamente "PERFEITA" (usa só o que tem) ou "QUASE PERFEITA" (falta 1 simples)
- calorias: Calorias aproximadas (número)
- explicacao: Breve descrição atrativa
- time: Tempo de preparo (ex: 15min)
- category: Café, Almoço, Jantar ou Lanche
- tags: 2 tags curtas relevantes
- ingredientes_possuidos: Array de ingredientes da lista do usuário usados
- ingredientes_faltantes: Array com no máximo 1 ingrediente extra simples (string)
- modo_preparo: Passo a passo claro
- ingredientes: Array completo de ingredientes (string[]) para compatibilidade com o sistema.

Responda em Português no formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              tipo: { type: Type.STRING, enum: ["PERFEITA", "QUASE PERFEITA"] },
              calorias: { type: Type.NUMBER },
              explicacao: { type: Type.STRING },
              time: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Café", "Almoço", "Jantar", "Lanche"] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              ingredientes_possuidos: { type: Type.ARRAY, items: { type: Type.STRING } },
              ingredientes_faltantes: { type: Type.ARRAY, items: { type: Type.STRING } },
              ingredientes: { type: Type.ARRAY, items: { type: Type.STRING } },
              modo_preparo: { type: Type.STRING }
            },
            required: ["nome", "tipo", "calorias", "explicacao", "time", "category", "tags", "ingredientes_possuidos", "ingredientes_faltantes", "ingredientes", "modo_preparo"]
          }
        }
      }
    });
    const text = response.text;
    if (!text) return [];
    
    try {
      const results = JSON.parse(text);
      return (Array.isArray(results) ? results : []).map((r: any, i: number) => ({
        ...r,
        id: `fridge-${Date.now()}-${i}`
      }));
    } catch (e) {
      console.error("Error parsing fridge recipes JSON", e);
      return [];
    }
  } catch (error) {
    console.error("Fridge recipes failed:", error);
    return [];
  }
}

export async function generateWorkouts(query: string, time?: number) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um treino de ${time || 20} minutos focado em: "${query}". Inclua nome do exercício, tutorial curto e benefícios. Responda em Português.`,
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
                  duration: { type: Type.STRING }
                },
                required: ["name", "tutorial", "duration"]
              }
            }
          },
          required: ["title", "exercises"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Workout generation failed:", error);
    return null;
  }
}

export async function generateDailyMotivation() {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma frase de motivação curta e inspiradora (máximo 100 caracteres) em Português focada em saúde, dieta ou exercícios. Não use emojis.",
    });
    return response.text.trim();
  } catch (error) {
    console.error("Motivation generation failed:", error);
    return "Cuidar de si é o melhor investimento! 💚";
  }
}

export async function generateShoppingList(goal: string, currentItems: string[]) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Com base no objetivo "${goal}" e considerando que o usuário já tem estes itens em casa: ${currentItems.join(', ')}, gere uma lista de 5 a 10 alimentos saudáveis e essenciais que estão faltando para completar uma dieta balanceada. Responda apenas um array JSON de strings com os nomes dos alimentos. Responda em Português.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Shopping list generation failed:", error);
    return ["Alface", "Tomate", "Frango", "Ovos", "Brócolis"];
  }
}

export async function generateFullDiet(profile: any, dietType: string) {
  try {
    const ai = getAI();
    const prompt = `Você é um nutricionista profissional. Gere um plano alimentar personalizado e completo (Café da manhã, Lanche da manhã, Almoço, Lanche da tarde e Jantar) para um usuário com: 
      Peso: ${profile.weight}kg, Altura: ${profile.height}cm, Objetivo: ${profile.goal}, Tipo de Dieta: ${dietType}.
      
      IMPORTANTE:
      - Forneça exatamente 5 refeições.
      - Use os campos exatos: 'type', 'nome', 'amount', 'calorias', 'benefit', 'ingredientes', 'modo_preparo'.
      - 'modo_preparo' deve ser um array de strings (passos).
      - 'ingredientes' deve ser um array de strings.
      - 'calorias' deve ser um NÚMERO.
      - 'type' deve ser um destes: "Café da manhã", "Almoço", "Jantar", "Lanche".
      
      Responda APENAS o JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["Café da manhã", "Almoço", "Jantar", "Lanche"] },
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

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Full diet generation failed:", error);
    // Return a minimal fallback to avoid UI freezing
    return [];
  }
}

export async function swapMeal(currentMeal: any, dietType: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sugira uma alternativa saudável e com calorias similares para esta refeição: ${currentMeal.nome} (${currentMeal.calorias} kcal). 
      O contexto da dieta é ${dietType}. 
      Responda uma única refeição no mesmo formato JSON: {type, nome, amount, calorias, benefit, ingredientes, modo_preparo}. 
      Responda em Português.`,
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Meal swap failed:", error);
    return currentMeal;
  }
}

export async function generateDietSuggestion(profile: any, recentHistory?: any) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Com base no perfil do usuário (${profile.goal}, ${profile.weight}kg) e comportamento recente (ex: "tem pulado o jantar"), gere uma dica nutricional curta, motivadora e prática (máximo 100 caracteres). Comece com um emoji. Responda em Português.`,
    });
    return response.text;
  } catch (error) {
    return "💡 Mantenha o foco: beber água ajuda a controlar o apetite!";
  }
}

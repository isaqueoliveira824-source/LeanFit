import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ou VITE_GEMINI_API_KEY não está definida nas variáveis de ambiente.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function analyzeFood(imageUri: string) {
  const ai = getAI();
  const matches = imageUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Formato de imagem inválido");
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const model = "gemini-1.5-flash";
  const prompt = "Analise esta imagem de comida. Forneça: Nome, Calorias (por 100g), Macronutrientes, Classificação (saudável, moderada, não recomendada), se pode comer (sim/não) com explicação e 3 alternativas mais saudáveis. Responda em Português.";

  const response = await ai.models.generateContent({
    model,
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: prompt }
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
  return JSON.parse(response.text);
}

export async function chatLeanAI(message: string, userData: any, history: any[] = []) {
  const ai = getAI();
  const systemPrompt = `Você é o "Lean AI", um assistente de saúde e bem-estar amigável, motivador e altamente técnico em nutrição. 
      Dados do usuário: Peso: ${userData.weight}kg, Altura: ${userData.height}cm, Objetivo: ${userData.goal || 'Saúde geral'}.
      Responda de forma humana, clara e baseada nos dados do usuário. Foque em dieta, treino e saúde. 
      Mantenha as respostas concisas e práticas. Use emojis com moderação.`;

  const processedHistory = history
    .filter((h, i) => !(i === 0 && h.role === 'model'))
    .map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      { role: 'user', parts: [{ text: `Contexto do Usuário: Peso ${userData.weight}kg, Altura ${userData.height}cm, Objetivo ${userData.goal || 'Saúde'}.` }] },
      { role: 'model', parts: [{ text: 'Entendido. Como sua Nutricionista IA, estou pronta para ajudar com base no seu perfil. Em que posso ser útil agora?' }] },
      ...processedHistory
    ],
    config: { systemInstruction: systemPrompt }
  });
  return response.text;
}

export async function generateDietPlan(userData: any) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: `Crie um plano alimentar diário personalizado (Café da Manhã, Almoço, Jantar e Lanches).
    Perfil: Peso ${userData.weight}kg, Altura ${userData.height}cm, Preferências: ${userData.preferences?.join(', ') || 'Nenhuma'}. Responda em Português.` }]}],
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
}

export async function generateRecipes(query: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
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
  return JSON.parse(response.text);
}

export async function generateFullDiet(profile: any, dietType: string) {
  const ai = getAI();
  const prompt = `Você é um nutricionista profissional e especialista em dietas personalizadas.
    Gere um plano alimentar diário COMPLETO (Café da manhã, Lanche da manhã, Almoço, Lanche da tarde e Jantar) focado em: ${dietType}.
    Perfil do paciente: Peso: ${profile.weight}kg, Altura: ${profile.height}cm, Objetivo: ${profile.goal}.
    
    REGRAS PARA O JSON:
    1. Forneça exatamente 5 refeições.
    2. Use os campos: 'type', 'nome', 'amount', 'calorias', 'benefit', 'ingredientes', 'modo_preparo'.
    3. 'modo_preparo' deve ser um ARRAY de strings (passos numerados).
    4. 'ingredientes' deve ser um ARRAY de strings com quantidades.
    5. 'calorias' deve ser um NÚMERO INTEIRO.
    6. 'type' deve ser um destes: "Café da manhã", "Lanche", "Almoço", "Lanche", "Jantar".
    
    Responda APENAS o JSON no formato de array de objetos. Responda em Português.`;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
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
  return JSON.parse(response.text);
}

export async function generateFridgeRecipes(ingredients: string[]) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: `Você é um nutricionista inteligente e especialista em receitas saudáveis.
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

Responda em Português no formato JSON.` }]}],
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
  return JSON.parse(response.text);
}

export async function generateWorkouts(query: string, time?: number) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: `Gere um treino de ${time || 20} minutos focado em: "${query}". Inclua nome do exercício, tutorial curto e benefícios. Responda em Português.` }]}],
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
}

export async function generateDailyMotivation() {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: "Gere uma frase de motivação curta e inspiradora (máximo 100 caracteres) em Português focada em saúde, dieta ou exercícios. Não use emojis." }]}],
  });
  return response.text.trim();
}

export async function generateShoppingList(goal: string, currentItems: string[]) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: `Com base no objetivo "${goal}" e considerando que o usuário já tem estes itens em casa: ${currentItems.join(', ')}, gere uma lista de 5 a 10 alimentos saudáveis e essenciais que estão faltando para completar uma dieta balanceada. Responda apenas um array JSON de strings com os nomes dos alimentos. Responda em Português.` }]}],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text);
}

export async function swapMeal(currentMeal: any, dietType: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: `Sugira uma alternativa saudável e com calorias similares (margem de +/- 10%) para esta refeição: ${currentMeal.nome} (${currentMeal.calorias} kcal). 
    O contexto da dieta é o tipo: ${dietType}. 
    Responda uma única refeição nova no mesmo formato JSON: {type, nome, amount, calorias, benefit, ingredientes, modo_preparo}. 
    Use ingredientes simples e acessíveis. Responda APENAS o JSON em Português.` }]}],
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
}

export async function generateDietSuggestion(profile: any) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ role: 'user', parts: [{ text: `Com base no perfil do usuário (${profile.goal}, ${profile.weight}kg), gere uma dica nutricional curta, motivadora e muito prática (máximo 80 caracteres). Foque em um hábito alcançável. Comece com um emoji relacionado. Responda em Português.` }]}],
  });
  return response.text || "💡 Mantenha o foco: beber água ajuda a controlar o apetite!";
}

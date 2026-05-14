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

async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function analyzeFood(imageUri: string): Promise<FoodAnalysis> {
  try {
    return await apiFetch('/api/ai/analyze-food', {
      method: 'POST',
      body: JSON.stringify({ imageUri }),
    });
  } catch (error) {
    console.error("AI Scan failed:", error);
    throw error;
  }
}

export async function chatLeanAI(message: string, userData: any, history: any[] = []) {
  try {
    const response = await apiFetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userData, history }),
    });
    return response.text;
  } catch (error) {
    console.error("Chat failed:", error);
    return "Desculpe, tive um problema de conexão com meus servidores de IA. Posso tentar de novo? Verifique se sua internet está estável.";
  }
}

export async function generateRecipes(query: string) {
  try {
    const results = await apiFetch('/api/ai/generate-recipes', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
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
    return await apiFetch('/api/ai/generate-diet', {
      method: 'POST',
      body: JSON.stringify({ userData }),
    });
  } catch (error) {
    console.error("Diet plan failed:", error);
    return [];
  }
}

export async function generateFridgeRecipes(ingredients: string[]) {
  try {
    const results = await apiFetch('/api/ai/fridge-recipes', {
      method: 'POST',
      body: JSON.stringify({ ingredients }),
    });
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
    return await apiFetch('/api/ai/workouts', {
      method: 'POST',
      body: JSON.stringify({ query, time }),
    });
  } catch (error) {
    console.error("Workout generation failed:", error);
    return null;
  }
}

export async function generateDailyMotivation() {
  try {
    const response = await apiFetch('/api/ai/motivation');
    return response.text;
  } catch (error) {
    console.error("Motivation generation failed:", error);
    return "Cuidar de si é o melhor investimento! 💚";
  }
}

export async function generateShoppingList(goal: string, currentItems: string[]) {
  try {
    return await apiFetch('/api/ai/shopping-list', {
      method: 'POST',
      body: JSON.stringify({ goal, currentItems }),
    });
  } catch (error) {
    console.error("Shopping list generation failed:", error);
    return ["Alface", "Tomate", "Frango", "Ovos", "Brócolis"];
  }
}

export async function generateFullDiet(profile: any, dietType: string) {
  try {
    return await apiFetch('/api/ai/full-diet', {
      method: 'POST',
      body: JSON.stringify({ profile, dietType }),
    });
  } catch (error) {
    console.error("Full diet generation failed:", error);
    throw error;
  }
}

export async function swapMeal(currentMeal: any, dietType: string) {
  try {
    return await apiFetch('/api/ai/swap-meal', {
      method: 'POST',
      body: JSON.stringify({ currentMeal, dietType }),
    });
  } catch (error) {
    console.error("Meal swap failed:", error);
    return currentMeal;
  }
}

export async function generateDietSuggestion(profile: any) {
  try {
    const response = await apiFetch('/api/ai/diet-suggestion', {
      method: 'POST',
      body: JSON.stringify({ profile }),
    });
    return response.text || "💡 Mantenha o foco: beber água ajuda a controlar o apetite!";
  } catch (error) {
    return "💡 Mantenha o foco: beber água ajuda a controlar o apetite!";
  }
}

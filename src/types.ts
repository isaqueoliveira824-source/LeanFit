export type ActivityLevel = 'Sedentário' | 'Levemente ativo' | 'Moderadamente ativo' | 'Muito ativo';

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  goal: string;
  foodPreferences: string[];
  activityLevel: ActivityLevel;
  healthGoals: string[];
  weightHistory: WeightEntry[];
  dietaryPreferences: string[];
  dislikedIngredients: string[];
  onboardingComplete: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
  image: string;
}

export interface Workout {
  id: string;
  name: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  description: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Início' | 'Consistência' | 'Alimentação' | 'Treinos' | 'Evolução';
  current: number;
  total: number;
  status: 'locked' | 'progress' | 'completed';
}

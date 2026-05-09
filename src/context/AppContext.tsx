import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../constants/achievements';
// import { auth, db } from '../lib/firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
// import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  category?: string;
}

interface Meal {
  id: string;
  type: string;
  nome: string;
  amount: string;
  calorias: number;
  benefit: string;
  ingredientes: string[];
  modo_preparo: string[];
  image?: string;
}

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  shoppingList: ShoppingItem[];
  fridgeItems: string[];
  dietPlan: Meal[];
  dietType: string;
  consistency: number;
  streak: number;
  waterIntake: number;
  waterGoal: number;
  waterStreak: number;
  hasEvaluated: boolean;
  loading: boolean;
  achievements: Achievement[];
  updateAchievement: (id: string, amount: number, type?: 'set' | 'add') => void;
  login: (userData: any) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: Omit<UserProfile, 'onboardingComplete'>) => void;
  addToShoppingList: (items: string | string[]) => void;
  toggleShoppingItem: (id: string) => void;
  removeFromShoppingList: (id: string) => void;
  clearShoppingList: () => void;
  addToFridge: (items: string | string[]) => void;
  removeFromFridge: (item: string) => void;
  setDietType: (type: string) => void;
  updateDietPlan: (plan: Meal[]) => void;
  updateMeal: (oldMealId: string, newMeal: Meal) => void;
  addWater: (amount: number) => void;
  resetWater: () => void;
  setHasEvaluated: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [fridgeItems, setFridgeItems] = useState<string[]>([]);
  const [dietPlan, setDietPlan] = useState<Meal[]>([]);
  const [dietType, setDietType] = useState('Equilibrada');
  const [consistency, setConsistency] = useState(85);
  const [streak, setStreak] = useState(12);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [waterStreak, setWaterStreak] = useState(3);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Firebase Auth Listener - REMOVED
  useEffect(() => {
    const savedUser = localStorage.getItem('leanfit_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    } else {
      // Default initial profile for new users
      setUser({
        name: 'Membro',
        weight: 70,
        height: 170,
        goal: 'Manter Peso',
        foodPreferences: [],
        activityLevel: 'Moderadamente ativo',
        healthGoals: [],
        weightHistory: [],
        dietaryPreferences: [],
        dislikedIngredients: [],
        onboardingComplete: false,
      });
    }
    setIsAuthenticated(true); // Always authenticated
    setLoading(false);
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('leanfit_user', JSON.stringify(user));
    }
  }, [user]);

  // Sync consistency achievements
  useEffect(() => {
    if (isAuthenticated) {
      updateAchievement('a4', streak, 'set');
      updateAchievement('a5', Math.floor(streak / 3), 'set');
      updateAchievement('a6', streak, 'set');
    }
  }, [streak, isAuthenticated]);

  // Load from localStorage on mount (only for app state, not auth)
  useEffect(() => {
    const savedShopping = localStorage.getItem('leanfit_shopping');
    const savedFridge = localStorage.getItem('leanfit_fridge');
    const savedDietPlan = localStorage.getItem('leanfit_diet_plan');
    const savedDietType = localStorage.getItem('leanfit_diet_type');
    const savedWaterIntake = localStorage.getItem('leanfit_water_intake');
    const savedWaterGoal = localStorage.getItem('leanfit_water_goal');
    const savedWaterStreak = localStorage.getItem('leanfit_water_streak');
    const savedHasEvaluated = localStorage.getItem('leanfit_has_evaluated');
    const savedAchievements = localStorage.getItem('leanfit_achievements');

    if (savedShopping) {
      try {
        const parsed = JSON.parse(savedShopping);
        if (Array.isArray(parsed)) setShoppingList(parsed);
      } catch (e) {
        console.error("Error parsing shopping list", e);
      }
    }
    if (savedFridge) {
      try {
        const parsed = JSON.parse(savedFridge);
        if (Array.isArray(parsed)) setFridgeItems(parsed);
      } catch (e) {
        console.error("Error parsing fridge items", e);
      }
    }
    if (savedDietPlan) {
      try {
        const parsed = JSON.parse(savedDietPlan);
        if (Array.isArray(parsed)) setDietPlan(parsed);
      } catch (e) {
        console.error("Error parsing diet plan", e);
      }
    }
    if (savedDietType) setDietType(savedDietType);
    if (savedWaterIntake) {
      try {
        const parsed = JSON.parse(savedWaterIntake);
        if (typeof parsed === 'number') setWaterIntake(parsed);
      } catch (e) { console.error(e); }
    }
    if (savedWaterGoal) {
      try {
        const parsed = JSON.parse(savedWaterGoal);
        if (typeof parsed === 'number') setWaterGoal(parsed);
      } catch (e) { console.error(e); }
    }
    if (savedWaterStreak) {
      try {
        const parsed = JSON.parse(savedWaterStreak);
        if (typeof parsed === 'number') setWaterStreak(parsed);
      } catch (e) { console.error(e); }
    }
    if (savedHasEvaluated) {
      try {
        const parsed = JSON.parse(savedHasEvaluated);
        if (typeof parsed === 'boolean') setHasEvaluated(parsed);
      } catch (e) { console.error(e); }
    }
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        if (Array.isArray(parsed)) setAchievements(parsed);
      } catch (e) {
        console.error("Error parsing achievements", e);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('leanfit_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('leanfit_fridge', JSON.stringify(fridgeItems));
  }, [fridgeItems]);

  useEffect(() => {
    localStorage.setItem('leanfit_diet_plan', JSON.stringify(dietPlan));
  }, [dietPlan]);

  useEffect(() => {
    localStorage.setItem('leanfit_diet_type', dietType);
  }, [dietType]);

  useEffect(() => {
    localStorage.setItem('leanfit_water_intake', JSON.stringify(waterIntake));
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem('leanfit_water_goal', JSON.stringify(waterGoal));
  }, [waterGoal]);

  useEffect(() => {
    localStorage.setItem('leanfit_water_streak', JSON.stringify(waterStreak));
  }, [waterStreak]);

  useEffect(() => {
    localStorage.setItem('leanfit_has_evaluated', JSON.stringify(hasEvaluated));
  }, [hasEvaluated]);

  useEffect(() => {
    localStorage.setItem('leanfit_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const addToShoppingList = (items: string | string[]) => {
    const newItems = Array.isArray(items) ? items : [items];
    const itemsToAdd = newItems.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      completed: false
    }));
    setShoppingList(prev => [...prev, ...itemsToAdd]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const clearShoppingList = () => setShoppingList([]);

  const addToFridge = (items: string | string[]) => {
    const newItems = Array.isArray(items) ? items : [items];
    setFridgeItems(prev => [...new Set([...prev, ...newItems])]);
  };

  const removeFromFridge = (item: string) => {
    setFridgeItems(prev => prev.filter(i => i !== item));
  };

  const updateDietPlan = (plan: Meal[]) => {
    const planWithIds = plan.map(m => ({ ...m, id: m.id || Math.random().toString(36).substr(2, 9) }));
    setDietPlan(planWithIds);
  };

  const updateMeal = (oldMealId: string, newMeal: Meal) => {
    setDietPlan(prev => prev.map(m => m.id === oldMealId ? { ...newMeal, id: oldMealId } : m));
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
    updateAchievement('a2', 1, 'add');
  };

  const updateAchievement = (id: string, amount: number, type: 'set' | 'add' = 'set') => {
    setAchievements(prev => prev.map(a => {
      if (a.id !== id) return a;
      
      let nextValue = type === 'add' ? a.current + amount : amount;
      if (nextValue > a.total) nextValue = a.total;

      const isCompleted = nextValue >= a.total;
      const nextStatus = isCompleted ? 'completed' : nextValue > 0 ? 'progress' : a.status;

      return {
        ...a,
        current: nextValue,
        status: nextStatus as any
      };
    }));
  };

  const resetWater = () => {
    setWaterIntake(0);
  };

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('leanfit_user');
    localStorage.removeItem('leanfit_onboarding_complete');
    // For complete reset, we might want to clear more, but let's just reset auth state
    window.location.reload(); 
  };

  const updateProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updatedFields };
    setUser(newProfile);
  };

  const completeOnboarding = async (profile: Omit<UserProfile, 'onboardingComplete'>) => {
    const fullProfile = { 
      ...profile, 
      onboardingComplete: true,
      healthGoals: profile.healthGoals || [],
      weightHistory: profile.weightHistory || [{ date: new Date().toISOString(), weight: profile.weight }],
      dietaryPreferences: profile.dietaryPreferences || [],
      dislikedIngredients: profile.dislikedIngredients || []
    };

    setUser(fullProfile);
    updateAchievement('a1', 1, 'set');
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isAuthenticated, 
      shoppingList,
      fridgeItems,
      dietPlan,
      dietType,
      consistency,
      streak,
      waterIntake,
      waterGoal,
      waterStreak,
      loading,
      login, 
      logout, 
      updateProfile,
      completeOnboarding,
      addToShoppingList,
      toggleShoppingItem,
      removeFromShoppingList,
      clearShoppingList,
      addToFridge,
      removeFromFridge,
      setDietType,
      updateDietPlan,
      updateMeal,
      addWater,
      resetWater,
      hasEvaluated,
      setHasEvaluated: (val: boolean) => {
        setHasEvaluated(val);
        if (val) updateAchievement('a16', 1, 'set');
      },
      achievements,
      updateAchievement
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

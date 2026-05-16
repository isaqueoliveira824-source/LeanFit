import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Utensils, RefreshCw, ShoppingCart, 
  ChevronRight, Flame, Info, Sparkles, 
  Loader2, CheckCircle2, TrendingUp, Calendar,
  ArrowRight, ChefHat, Heart, Zap, ChevronLeft, Apple
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateFullDiet, swapMeal, generateDietSuggestion } from '../services/gemini';
import { cn } from '../lib/utils';
import { RecipeLibrary } from './RecipeLibrary';

export const DietPlan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    user, dietPlan, dietType, setDietType, 
    updateDietPlan, updateMeal, addToShoppingList,
    consistency, streak 
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState<string | null>(null);
  const [swapOptionsFor, setSwapOptionsFor] = useState<any>(null);
  const [selectedMealForRecipe, setSelectedMealForRecipe] = useState<any>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>("Carregando dica inteligente...");
  const [notification, setNotification] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dietTypes = [
    { id: 'Emagrecimento', label: 'Emagrecer', icon: '🥗' },
    { id: 'Ganho de massa', label: 'Ganho de Massa', icon: '🥩' },
    { id: 'Low carb', label: 'Low Carb', icon: '🥑' },
    { id: 'Manutenção', label: 'Manutenção', icon: '⚖️' }
  ];

  useEffect(() => {
    if (dietPlan.length === 0 && user) {
      handleGenerateDiet(dietType);
    }
    loadSuggestion();
  }, []);

  const loadSuggestion = async () => {
    if (!user) return;
    const suggestion = await generateDietSuggestion(user);
    setAiSuggestion(suggestion);
  };

  const handleGenerateDiet = async (type: string) => {
    setIsLoading(true);
    setSwapOptionsFor(null);
    setNotification(null);
    try {
      const plan = await generateFullDiet(user, type);
      if (plan && plan.length > 0) {
        updateDietPlan(plan);
        setDietType(type);
      } else {
        throw new Error("Plano vazio recebido");
      }
    } catch (error) {
      console.error(error);
      setNotification("Ocorreu um erro ao gerar sua dieta. Por favor, verifique sua conexão e tente novamente em instantes.");
      setTimeout(() => setNotification(null), 6000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async (meal: any) => {
    setSwapOptionsFor(null);
    setIsSwapping(meal.id);
    try {
      const newMeal = await swapMeal(meal, dietType);
      updateMeal(meal.id, newMeal);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSwapping(null);
    }
  };

  const handleAddIngredients = (meal: any) => {
    addToShoppingList(meal.ingredientes);
    setNotification("Todos os alimentos foram adicionados para sua compra 💚. Cozinhar em casa é o melhor presente para sua saúde!");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto"
    >
      {/* Header */}
      <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50">
        <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
            <Apple size={18} />
          </div>
          <h2 translate="no" className="text-lg font-bold text-slate-800 tracking-tight">Plano Alimentar</h2>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 pb-24 scroll-smooth">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className="fixed top-0 left-1/2 z-[100] w-[90%] max-w-md bg-white rounded-2xl p-4 shadow-2xl border border-emerald-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight">
                {notification}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestion Card */}
        <div className="mt-6 p-5 bg-orange-50 rounded-[2.5rem] border border-orange-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
             <Zap size={20} />
          </div>
          <p className="text-sm font-bold text-orange-700 leading-tight">
             {aiSuggestion}
          </p>
        </div>

        {/* Diet Type Selector */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo de Dieta</h3>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Deslize para ver mais</span>
          </div>
          
          <div className="relative group -mx-2">
            {/* Left Fade Indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            
            {/* Right Fade Indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* Content Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto no-scrollbar py-3 px-4 relative items-center scroll-smooth shadow-inner-sm"
            >
              {dietTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleGenerateDiet(type.id)}
                  className={cn(
                    "px-6 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-3 shrink-0 h-14",
                    dietType === type.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] scale-105" 
                      : "bg-white border-slate-100 text-slate-500 hover:border-orange-200 shadow-sm"
                  )}
                >
                  <span className="text-xl filter drop-shadow-sm">{type.icon}</span>
                  <span>{type.label}</span>
                  {dietType === type.id && (
                    <motion.div 
                      layoutId="activeCircle"
                      className="w-1.5 h-1.5 rounded-full bg-orange-400" 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meal List */}
        <div className="mt-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p className="text-slate-400 font-bold">Criação personalizada da IA...</p>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center px-10">Isso pode levar alguns segundos enquanto calculamos seus macros</p>
              </div>
            ) : dietPlan.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Utensils size={40} />
                </div>
                <p className="text-slate-500 font-bold italic">Nenhum plano gerado ainda.</p>
                <button 
                  onClick={() => handleGenerateDiet(dietType)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                >
                  Gerar Minha Dieta Agora
                </button>
              </div>
            ) : (
              dietPlan.map((meal, idx) => (
                <motion.div 
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-50 space-y-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                      <Utensils size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{meal.type}</h4>
                      <h3 className="text-lg font-black text-slate-800 leading-tight">{meal.nome}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Quantidade</p>
                      <p className="text-xs font-bold text-slate-700">{meal.amount}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Calorias</p>
                      <p className="text-xs font-bold text-emerald-600">{meal.calorias} kcal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl">
                    <Heart size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                       “{meal.benefit}”
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSwapOptionsFor(meal)}
                      disabled={isSwapping === meal.id}
                      className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                    >
                      {isSwapping === meal.id ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                      Trocar
                    </button>
                    <button 
                      onClick={() => handleAddIngredients(meal)}
                      className="flex-1 py-3 bg-orange-50 text-orange-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
                    >
                      <ShoppingCart size={14} />
                      Lista
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedMealForRecipe(meal);
                        setShowRecipeModal(true);
                      }}
                      className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                      Receita
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {swapOptionsFor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setSwapOptionsFor(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 space-y-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center pb-2">
                <h4 className="text-lg font-black text-slate-800">Opções de Troca</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">O que você deseja fazer?</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleSwap(swapOptionsFor)}
                  className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-3"
                >
                  <ChefHat size={18} />
                  Trocar Receita
                </button>
                <button 
                  onClick={() => handleGenerateDiet(dietType)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
                >
                  <RefreshCw size={18} />
                  Trocar Dieta Inteira
                </button>
                <button 
                  onClick={() => setSwapOptionsFor(null)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors mt-2"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showRecipeModal && selectedMealForRecipe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-0 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Compact Header for Modal */}
              <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50 sticky top-0 z-10 w-full">
                <button onClick={() => setShowRecipeModal(false)} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
                  <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col">
                  <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none mb-1">{selectedMealForRecipe.type}</h4>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none">{selectedMealForRecipe.nome}</h3>
                </div>
              </header>

              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="bg-orange-50 rounded-[2.5rem] p-6 flex items-center justify-center border-2 border-orange-100 border-dashed">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto text-orange-500 shadow-sm">
                      <ChefHat size={24} />
                    </div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Receita 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁</p>
                  </div>
                </div>
                <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Ingredientes</h5>
                <ul className="grid grid-cols-1 gap-2">
                  {selectedMealForRecipe.ingredientes.map((ing: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Modo de Preparo</h5>
                <div className="space-y-4">
                  {Array.isArray(selectedMealForRecipe.modo_preparo) ? (
                    selectedMealForRecipe.modo_preparo.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-[10px] font-black shrink-0 border border-orange-100">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {selectedMealForRecipe.modo_preparo || "Modo de preparo não disponível"}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="text-orange-500" size={24} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Calorias</span>
                    <span className="text-lg font-black text-slate-800">{selectedMealForRecipe.calorias} kcal</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowRecipeModal(false)}
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Pronto para cozinhar
              </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

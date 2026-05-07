import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChefHat, Clock, Flame, Utensils, Loader2, Sparkles, Plus, Refrigerator, ChevronRight, Play, ShoppingCart, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { generateRecipes, generateFridgeRecipes } from '../services/gemini';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { STATIC_RECIPES, Recipe } from '../constants/recipes';

type Category = 'Todas' | 'Café' | 'Almoço' | 'Jantar' | 'Lanche';

export const RecipeLibrary: React.FC<{ onClose: () => void; isFridge?: boolean }> = ({ onClose, isFridge = false }) => {
  const { addToShoppingList, fridgeItems: globalFridgeItems, addToFridge, removeFromFridge, updateAchievement } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('Todas');
  const [ingredientInput, setIngredientInput] = useState('');
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);

  React.useEffect(() => {
    updateAchievement('a3', 1, 'set');
  }, []);

  const categories: Category[] = ['Todas', 'Café', 'Almoço', 'Jantar', 'Lanche'];

  // Filter and Search Logic
  const filteredRecipes = useMemo(() => {
    let list = isFridge ? [...aiRecipes] : [...STATIC_RECIPES, ...aiRecipes];
    
    // Remove duplicates by name
    list = list.filter((v, i, a) => a.findIndex(t => t.nome === v.nome) === i);

    if (activeCategory !== 'Todas') {
      list = list.filter(r => r.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r => 
        r.nome.toLowerCase().includes(q) || 
        r.ingredientes.some(ing => ing.toLowerCase().includes(q)) ||
        r.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [query, activeCategory, aiRecipes]);

  const handleAISearch = async () => {
    if (!query.trim() && !isFridge) return;
    setIsLoading(true);
    try {
      if (isFridge) {
        const results = await generateFridgeRecipes(globalFridgeItems);
        // Map results to our Recipe structure if needed
        setAiRecipes(results as Recipe[]);
      } else {
        const results = await generateRecipes(query);
        setAiRecipes(prev => [...prev, ...results as Recipe[]]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    addToFridge(ingredientInput.trim());
    setIngredientInput('');
  };

  const removeIngredient = (item: string) => {
    removeFromFridge(item);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="max-w-4xl mx-auto min-h-full bg-[#fcfcfc]">
        {/* Header Updated to Compact Style */}
        <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50">
          <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
              <ChefHat size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isFridge ? 'Geladeira Mágica' : 'Receitas Saudáveis'}
            </h2>
          </div>
        </header>

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
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-700 leading-tight">
                {notification}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 py-6 space-y-6">

          {/* Search Bar or Fridge Input */}
          {isFridge ? (
            <div className="space-y-4">
               <div className="flex gap-2">
                 <div className="relative flex-1">
                   <Refrigerator className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                   <input 
                     type="text"
                     value={ingredientInput}
                     onChange={(e) => setIngredientInput(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                     placeholder="Ex: Ovos, Frango..."
                     className="w-full bg-[#f1f5f9]/80 border-none rounded-2xl pl-12 pr-4 py-5 text-slate-600 font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                   />
                 </div>
                 <button 
                   onClick={addIngredient}
                   className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                 >
                   <Plus size={24} />
                 </button>
               </div>
               
               <div className="flex flex-wrap gap-2">
                 {globalFridgeItems.map(item => (
                   <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100">
                     {item}
                     <X size={14} className="cursor-pointer hover:text-emerald-800" onClick={() => removeIngredient(item)} />
                   </span>
                 ))}
               </div>

               {globalFridgeItems.length > 0 && (
                 <button 
                   onClick={handleAISearch}
                   disabled={isLoading}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                   Gerar Receitas com IA
                 </button>
               )}
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar: queijo, hambúrguer, frango..."
                className="w-full bg-[#f1f5f9]/80 border-none rounded-2xl pl-12 pr-4 py-5 text-slate-600 font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
              />
              {query.trim() && (
                <button 
                  onClick={handleAISearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  IA
                </button>
              )}
            </div>
          )}

          {/* Categories Scroller */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCategory(cat);
                }}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95",
                  activeCategory === cat 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="px-6 pb-32">
          {isLoading && aiRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-slate-400 font-medium">Buscando as melhores receitas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredRecipes.map((recipe, i) => (
                  <motion.div 
                    key={recipe.id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all active:scale-[0.98] flex flex-col h-full cursor-pointer group"
                  >
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                             <ChefHat size={16} />
                          </div>
                          {recipe.tipo && (
                            <span className={cn(
                              "text-[9px] font-black px-2 py-1 rounded-lg tracking-wider",
                              recipe.tipo === 'PERFEITA' 
                                ? "bg-emerald-500 text-white shadow-xs" 
                                : "bg-amber-500 text-white shadow-xs"
                            )}>
                              {recipe.tipo === 'PERFEITA' ? '🔥 PERFEITA' : '👍 QUASE'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50/50 px-2 py-1 rounded-lg">
                          <Flame size={12} />
                          <span className="text-[10px] font-bold">{recipe.calorias} kcal</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-800 text-base leading-tight mb-2 line-clamp-2">{recipe.nome}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">{recipe.explicacao}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[10px] font-medium">{recipe.time}</span>
                        </div>
                        <div className="flex gap-1">
                          {recipe.tags.slice(0, 1).map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[9px] font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredRecipes.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ChefHat size={40} />
              </div>
              <div>
                <p className="text-slate-600 font-bold">Nenhuma receita encontrada</p>
                <p className="text-slate-400 text-sm">
                  {isFridge 
                    ? "Não foi possível criar receitas saudáveis apenas com esses itens. Tente adicionar ingredientes básicos como ovos ou aveia!" 
                    : "Tente buscar por termos como 'ovo' ou 'frango'"}
                </p>
              </div>
              <button 
                onClick={handleAISearch}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
              >
                <Sparkles size={18} />
                Gerar com IA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Detail Modal Redesigned */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-2xl rounded-t-[3rem] sm:rounded-[3rem] max-h-[95vh] overflow-y-auto flex flex-col relative"
            >
              {/* Sticky Header in Detail */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-50">
                <button onClick={() => setSelectedRecipe(null)} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
                  <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      addToShoppingList(selectedRecipe.ingredientes);
                      setNotification("Todos os alimentos foram adicionados para sua compra 💚. Escolhas saudáveis hoje, vida longa amanhã!");
                      setTimeout(() => setNotification(null), 4000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold whitespace-nowrap shadow-md active:scale-95 transition-transform"
                  >
                    <ShoppingCart size={14} /> Adicionar à Lista
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold whitespace-nowrap">
                    <Utensils size={14} /> Salvar Receita
                  </button>
                </div>
              </div>

              <div className="px-8 pb-12 space-y-8">
                {selectedRecipe.tipo && (
                  <div className={cn(
                    "mt-4 rounded-3xl p-4 flex items-center justify-center gap-2",
                    selectedRecipe.tipo === 'PERFEITA' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                  )}>
                    <Sparkles size={18} />
                    <span className="text-sm font-black tracking-wide">
                      {selectedRecipe.tipo === 'PERFEITA' 
                        ? '🔥 RECEITA PERFEITA (TUDO NA MÃO)' 
                        : '👍 QUASE PERFEITA (SÓ FALTA 1 ITEM)'}
                    </span>
                  </div>
                )}
                <div className="bg-emerald-50 rounded-[2.5rem] p-8 flex items-center justify-center border-2 border-emerald-100 border-dashed">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-emerald-500 shadow-sm">
                      <ChefHat size={32} />
                    </div>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Receita 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                      {selectedRecipe.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                          {tag}
                        </span>
                      ))}
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Calorias</span>
                         <span className="font-bold text-slate-800">{selectedRecipe.calorias} kcal</span>
                      </div>
                      <div className="w-px h-6 bg-slate-100" />
                      <div className="flex flex-col items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Tempo</span>
                         <span className="font-bold text-slate-800">{selectedRecipe.time}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">{selectedRecipe.nome}</h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">{selectedRecipe.explicacao}</p>
                </div>

                {/* Ingredients Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-800">Ingredientes</h4>
                    <span className="text-xs font-bold text-emerald-500">{selectedRecipe?.ingredientes?.length || 0} itens</span>
                  </div>

                  {selectedRecipe.ingredientes_possuidos && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Você já tem ✅</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedRecipe.ingredientes_possuidos.map((ing: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-sm font-semibold text-slate-700">{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRecipe.ingredientes_faltantes && selectedRecipe.ingredientes_faltantes.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Ingrediente Extra Necessário ⚠️</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedRecipe.ingredientes_faltantes.map((ing: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                            <Plus size={14} className="text-rose-500" />
                            <span className="text-sm font-black text-rose-600">{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!selectedRecipe.ingredientes_possuidos && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedRecipe.ingredientes.map((ing: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-sm font-semibold text-slate-700">{ing}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preparation Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-800">Modo de Preparo</h4>
                  <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                    {Array.isArray(selectedRecipe.modo_preparo) ? (
                      selectedRecipe.modo_preparo.map((step: string, i: number) => (
                        <div key={i} className="flex gap-6 group">
                          <div className="flex flex-col items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                              {i + 1}
                            </span>
                            {i < selectedRecipe.modo_preparo.length - 1 && (
                              <div className="w-px flex-1 bg-slate-100" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p>{step}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>{selectedRecipe.modo_preparo}</p>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <button 
                  onClick={() => {
                    updateAchievement('a8', 1, 'add');
                    setNotification("Refeição registrada com sucesso! 🥗");
                    setSelectedRecipe(null);
                  }}
                  className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-bold shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
                >
                  <Utensils size={24} />
                  Marcar como Feita
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

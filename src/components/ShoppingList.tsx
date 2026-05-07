import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShoppingCart, Plus, CheckCircle2, Circle, 
  Trash2, Sparkles, Refrigerator, ChevronRight, 
  Search, Loader2, ListChecks, ArrowRight, ChevronLeft, ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { generateShoppingList } from '../services/gemini';

export const ShoppingList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    shoppingList, 
    fridgeItems, 
    addToShoppingList, 
    toggleShoppingItem, 
    removeFromShoppingList, 
    clearShoppingList,
    user
  } = useApp();

  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'pendentes' | 'concluidos'>('todos');

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'pendentes': return shoppingList.filter(i => !i.completed);
      case 'concluidos': return shoppingList.filter(i => i.completed);
      default: return shoppingList;
    }
  }, [shoppingList, filter]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    addToShoppingList(newItem.trim());
    setNewItem('');
  };

  const handleGenerateAI = async () => {
    setIsLoading(true);
    try {
      // Suggest based on user goal and what's missing (simplified logic)
      const suggestions = await generateShoppingList(user?.goal || 'saudável', fridgeItems);
      addToShoppingList(suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen"
    >
      {/* Header - Fixed at top */}
      <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-100 shrink-0 z-10">
        <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Lista de Compras</h2>
        </div>
      </header>

      {/* Main Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto pb-32">
          {/* Action Tabs */}
          <div className="px-6 pt-6 mb-6">
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
              {(['todos', 'pendentes', 'concluidos'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize",
                    filter === t ? "bg-white text-sky-600 shadow-sm" : "text-slate-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="px-6 space-y-4 mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="Adicionar item manualmente..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 outline-hidden transition-all"
                />
              </div>
              <button 
                onClick={handleAddItem}
                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
              >
                <Plus size={24} />
              </button>
            </div>

            {/* AI Generator Button */}
            <button 
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="w-full py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
            >
              {isLoading ? <Loader2 className="animate-spin text-emerald-500" size={18} /> : <Sparkles size={18} />}
              Gerar Lista Inteligente (IA)
            </button>
          </div>

          {/* List Container */}
          <div className="px-6 space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group flex items-center justify-between p-5 bg-white rounded-2xl border transition-all cursor-pointer active:scale-[0.98]",
                    item.completed ? "border-slate-100 bg-slate-50/50" : "border-slate-100 shadow-sm border-l-4 border-l-emerald-500"
                  )}
                  onClick={() => toggleShoppingItem(item.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                      item.completed ? "bg-emerald-500 text-white" : "border-2 border-slate-200 text-transparent"
                    )}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span className={cn(
                      "font-bold text-slate-700 transition-all",
                      item.completed && "line-through text-slate-400 font-medium"
                    )}>
                      {item.name}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromShoppingList(item.id);
                    }}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                <ListChecks size={64} className="text-slate-300" />
                <div>
                  <p className="font-bold text-slate-600">Sua lista está vazia</p>
                  <p className="text-sm">Comece adicionando itens ou use a IA</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions - Fixed at bottom */}
      <footer className="shrink-0 p-6 bg-white border-t border-slate-50 z-10 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {shoppingList.length > 0 ? (
          <div className="flex gap-3 max-w-2xl mx-auto">
            <button 
              onClick={clearShoppingList}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
            >
              Limpar
            </button>
            <button 
              onClick={onClose}
              className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Pronto <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              Voltar
            </button>
          </div>
        )}
      </footer>
    </motion.div>
  );
};

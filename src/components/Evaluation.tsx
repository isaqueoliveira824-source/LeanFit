import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, CheckCircle2, Heart, MessageSquare, ChevronLeft, ThumbsUp, Plus, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

const FEEDBACK_OPTIONS = [
  'Fácil de usar',
  'Design bonito',
  'Me ajudou a emagrecer',
  'Gostei dos treinos',
  'Pode melhorar'
];

export const Evaluation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { setHasEvaluated } = useApp();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitted(true);
    setHasEvaluated(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });

    setTimeout(() => {
      onClose();
    }, 4000);
  };

  const getPlaceholder = () => {
    if (rating > 0 && rating <= 3) {
      return "Nos conte como podemos melhorar...";
    }
    return "O que você achou do 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁?";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto"
    >
      {/* Header */}
      <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50 sticky top-0 z-10">
        <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-500 flex items-center justify-center">
            <Star size={18} fill="currentColor" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Avaliar o App</h2>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6 space-y-8">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Star Rating Section */}
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto shadow-xl shadow-emerald-500/10">
                  <Heart size={40} fill="currentColor" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Sua jornada importa!</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Quantas estrelas o 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 merece?
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-all active:scale-150 hover:scale-110"
                    >
                      <motion.div
                        animate={{ 
                          scale: rating === star ? [1, 1.3, 1] : 1,
                          rotate: rating === star ? [0, 15, -15, 0] : 0
                        }}
                      >
                        <Star 
                          size={44} 
                          className={cn(
                            "transition-all duration-300",
                            star <= rating ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : "text-slate-100"
                          )} 
                        />
                      </motion.div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Feedback Tags */}
              <div className="space-y-4 px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Feedback Rápido</h4>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border",
                          isSelected 
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                            : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200"
                        )}
                      >
                        {isSelected ? <Check size={14} /> : <Plus size={14} className="text-slate-300" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-4 px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sua Opinião</h4>
                <div className="relative group">
                  <MessageSquare className="absolute left-5 top-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full bg-white border border-slate-100 rounded-[2rem] p-5 pl-14 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-hidden transition-all min-h-[140px] resize-none shadow-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="px-2 pb-12">
                <button 
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className={cn(
                    "w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3",
                    rating > 0 
                      ? "bg-emerald-500 text-white shadow-emerald-500/30 active:scale-95" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                >
                  <ThumbsUp size={20} />
                  Enviar Avaliação
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-12 text-center shadow-sm border border-slate-50 space-y-8 py-20 mt-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30"
              >
                <CheckCircle2 size={48} />
              </motion.div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Obrigado pela sua avaliação! 💚</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  Sua opinião nos ajuda a melhorar o 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁.
                </p>
              </div>

              {/* Achievement Reward Message */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center gap-3 justify-center"
              >
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                <div className="text-left">
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Nova Conquista!</p>
                  <p className="text-xs font-black text-yellow-700">Crítico Construtivo ⭐</p>
                </div>
              </motion.div>

              <button 
                onClick={onClose}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                Voltar ao Início
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, Droplets, Plus, 
  Trash2, Trophy, Flame, Bell, 
  Sparkles, CheckCircle2, AlertCircle, 
  TrendingUp, Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

export const WaterTracker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { waterIntake, waterGoal, waterStreak, addWater, resetWater, user } = useApp();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  const progress = Math.min((waterIntake / waterGoal) * 100, 100);
  const isGoalReached = waterIntake >= waterGoal;

  useEffect(() => {
    if (isGoalReached) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#38bdf8', '#7dd3fc']
      });
      setNotificationMsg('Parabéns! Meta de hidratação atingida! 💧');
      setShowNotification(true);
    }
  }, [isGoalReached]);

  const handleAddWater = (amount: number) => {
    addWater(amount);
    
    // Random motivational feedback
    const feedbacks = [
      'Show! Mais hidratação! 💧',
      'Seu corpo agradece! ✨',
      'Mandou bem! Continue assim.',
      'Refrescante, não é? 🌊'
    ];
    
    if (waterIntake + amount < waterGoal) {
      setNotificationMsg(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const achievements = [
    { id: 1, title: 'Primeira Gota', desc: 'Atingiu sua meta pela primeira vez', icon: <Droplets />, earned: waterStreak >= 1 },
    { id: 2, title: 'Consistente', desc: '3 dias seguidos batendo a meta', icon: <Flame />, earned: waterStreak >= 3 },
    { id: 3, title: 'Mestre da Hidratação', desc: '7 dias seguidos batendo a meta', icon: <Trophy />, earned: waterStreak >= 7 },
  ];

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
          <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center">
            <Droplets size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Monitor de Água</h2>
        </div>
      </header>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm bg-sky-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <Bell size={20} className="shrink-0" />
            <p className="text-sm font-bold">{notificationMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto p-6 space-y-8 pb-32">
        {/* Main Progress Card */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 text-center relative overflow-hidden">
          {/* Animated Background Water Level */}
          <motion.div 
             initial={{ height: 0 }}
             animate={{ height: `${progress}%` }}
             className="absolute bottom-0 left-0 right-0 bg-sky-50/50 -z-0"
             transition={{ type: 'spring', damping: 20, stiffness: 40 }}
          />
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Sua Meta Diária</span>
              <h1 className="text-4xl font-black text-slate-800">{(waterGoal / 1000).toFixed(1)}L</h1>
            </div>

            <div className="relative w-48 h-48 mx-auto">
              {/* Circular Progress SVG */}
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="96" cy="96" r="88" 
                  fill="none" stroke="currentColor" strokeWidth="12"
                  className="text-slate-100"
                />
                <motion.circle 
                  cx="96" cy="96" r="88" 
                  fill="none" stroke="currentColor" strokeWidth="12"
                  strokeDasharray="553"
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                  className="text-sky-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets size={40} className="text-sky-500 mb-1" />
                <span className="text-2xl font-black text-slate-800">{waterIntake}ml</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{progress.toFixed(0)}% concluído</span>
              </div>
            </div>

            {waterIntake === 0 && (
              <div className="flex items-center justify-center gap-2 text-rose-500 bg-rose-50 py-2 px-4 rounded-full w-fit mx-auto animate-pulse">
                <AlertCircle size={16} />
                <span className="text-xs font-bold">Você ainda não bebeu água hoje 😬</span>
              </div>
            )}

            {isGoalReached && (
              <div className="flex items-center justify-center gap-2 text-emerald-500 bg-emerald-50 py-2 px-4 rounded-full w-fit mx-auto">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">Hidratação nota 10!</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Registro Rápido</h3>
            <button onClick={resetWater} className="text-[10px] font-bold text-slate-300 hover:text-rose-500 transition-colors flex items-center gap-1">
              <Trash2 size={12} /> Limpar
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { amount: 200, label: 'Copo', desc: '200ml' },
              { amount: 500, label: 'Garrafa', desc: '500ml' },
              { amount: 1000, label: 'Jarreira', desc: '1L' }
            ].map((item) => (
              <button
                key={item.amount}
                onClick={() => handleAddWater(item.amount)}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200 active:scale-95 transition-all text-center space-y-1 group"
              >
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 mx-auto group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <div className="font-bold text-slate-800 text-sm">{item.label}</div>
                <div className="text-[10px] font-medium text-slate-400">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* consistency / streak */}
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-[2.5rem] p-6 text-white shadow-lg shadow-sky-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-sky-100 uppercase tracking-widest">Sua Consistência</h4>
            <p className="text-sm font-medium leading-relaxed">Você está há <strong>{waterStreak} dias</strong> mantendo sua hidratação! 🔥</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
             <TrendingUp size={32} />
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Conquistas</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-3xl border transition-all",
                  achievement.earned 
                    ? "bg-white border-sky-100 shadow-sm" 
                    : "bg-slate-50 border-slate-100 grayscale opacity-60"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  achievement.earned ? "bg-sky-50 text-sky-500" : "bg-slate-200 text-slate-400"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{achievement.title}</h4>
                  <p className="text-[10px] font-medium text-slate-400">{achievement.desc}</p>
                </div>
                {achievement.earned && (
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* motivational quote */}
        <div className="text-center px-4 py-8">
           <Sparkles size={24} className="text-sky-300 mx-auto mb-3" />
           <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
             "A água é o combustível essencial para sua jornada fitness. Beba e vença!"
           </p>
        </div>
      </main>
    </motion.div>
  );
};

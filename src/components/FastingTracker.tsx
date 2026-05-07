import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronUp, ChevronDown, Bell, Play, CheckCircle2, Pause, RotateCcw, ChevronLeft, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface FastingPreset {
  hours: number;
  label: string;
}

const PRESETS: FastingPreset[] = [
  { hours: 12, label: 'Iniciante' },
  { hours: 14, label: 'Moderado' },
  { hours: 16, label: 'Intermediário' },
  { hours: 18, label: 'Avançado' },
  { hours: 20, label: 'Expert' },
];

export const FastingTracker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [duration, setDuration] = useState(12);
  const [timeLeft, setTimeLeft] = useState(duration * 3600);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#38bdf8', '#fbbf24']
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustDuration = (amount: number) => {
    const newDuration = Math.max(1, Math.min(24, duration + amount));
    setDuration(newDuration);
    if (!isActive) setTimeLeft(newDuration * 3600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto"
    >
      {/* Header Updated to Compact Style */}
      <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50">
        <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
            <Clock size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Jejum Intermitente</h2>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6 max-w-md mx-auto w-full pb-32">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Duration Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col items-center gap-6 relative overflow-hidden">
                <p className="text-slate-400 font-bold text-lg">Duração do jejum</p>
                
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => adjustDuration(-1)}
                    disabled={isActive}
                    className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-100 disabled:opacity-50 transition-all"
                  >
                    <ChevronDown size={32} />
                  </button>
                  
                  <div className="text-center">
                    {isActive ? (
                      <div className="flex flex-col items-center">
                        <span className="text-6xl font-black text-emerald-500 tabular-nums">
                          {formatTime(timeLeft)}
                        </span>
                        <span className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Tempo Restante</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-8xl font-black text-emerald-500 leading-none">
                          {duration}
                        </span>
                        <span className="text-slate-400 font-bold mt-2 text-lg">horas</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => adjustDuration(1)}
                    disabled={isActive}
                    className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:bg-slate-100 disabled:opacity-50 transition-all"
                  >
                    <ChevronUp size={32} />
                  </button>
                </div>
              </div>

              {/* Presets */}
              {!isActive && (
                <div className="flex justify-between gap-2 overflow-x-auto pb-4 no-scrollbar">
                  {PRESETS.map((p) => (
                    <button
                      key={p.hours}
                      onClick={() => { setDuration(p.hours); setTimeLeft(p.hours * 3600); }}
                      className={cn(
                        "flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl border transition-all active:scale-95",
                        duration === p.hours 
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200" 
                          : "bg-white border-slate-100 text-slate-400"
                      )}
                    >
                      <span className="text-sm font-black">{p.hours}h</span>
                      <span className={cn("text-[9px] font-bold mt-0.5", duration === p.hours ? "text-emerald-100" : "text-slate-300")}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Notification Toggle */}
              <div 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    notificationsEnabled ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"
                  )}>
                    <Bell size={24} fill={notificationsEnabled ? "currentColor" : "none"} className={notificationsEnabled ? "animate-tada" : ""} />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-black text-lg leading-tight">Notificação</h4>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">
                      Você receberá uma notificação quando o jejum terminar
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300",
                  notificationsEnabled ? "bg-emerald-500" : "bg-slate-200"
                )}>
                  <motion.div 
                    animate={{ x: notificationsEnabled ? 26 : 2 }}
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="fixed bottom-10 left-0 right-0 px-6 max-w-md mx-auto">
                {isActive ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setIsActive(false); setTimeLeft(duration * 3600); }}
                      className="py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      <RotateCcw size={24} /> Resetar
                    </button>
                    <button 
                      onClick={() => setIsActive(false)}
                      className="py-5 bg-orange-500 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-200 active:scale-95 transition-all"
                    >
                      <Pause size={24} fill="currentColor" /> Pausar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsActive(true)}
                    className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                  >
                    <Play size={24} fill="currentColor" /> Iniciar Jejum
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200">
                <CheckCircle2 size={56} className="text-white" />
              </div>
              <div className="space-y-4 px-4">
                <h2 className="text-3xl font-black text-slate-800 leading-tight">
                  jejum concluído com sucesso 🚀
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                  Parabéns por ter concluído o jejum 🚀
                </p>
              </div>
              <button 
                onClick={() => { setIsCompleted(false); setTimeLeft(duration * 3600); }}
                className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-200 active:scale-95 transition-all"
              >
                Novo Jejum
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

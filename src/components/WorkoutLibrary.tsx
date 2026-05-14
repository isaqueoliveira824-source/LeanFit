import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Flame, Clock, BookOpen, Search, Sparkles, Loader2, 
  Plus, Minus, Play, CheckCircle2, Trophy, ArrowRight, ChevronLeft, Dumbbell
} from 'lucide-react';
import { generateWorkouts } from '../services/gemini';
import { cn } from '../lib/utils';

import { useApp } from '../context/AppContext';

interface Exercise {
  name: string;
  duration: string;
  calories: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  emoji: string;
}

const PRESET_EXERCISES: Exercise[] = [
  { name: 'Agachamentos', duration: '1 min', calories: '15 kcal', difficulty: 'Fácil', category: 'Força', emoji: '🏋️' },
  { name: 'Flexões', duration: '1 min', calories: '12 kcal', difficulty: 'Médio', category: 'Força', emoji: '💪' },
  { name: 'Prancha', duration: '1 min', calories: '8 kcal', difficulty: 'Fácil', category: 'Força', emoji: '🔥' },
  { name: 'Pular corda', duration: '15 min', calories: '200 kcal', difficulty: 'Médio', category: 'Cardio', emoji: '🤸' },
  { name: 'Burpees', duration: '1 min', calories: '18 kcal', difficulty: 'Difícil', category: 'Cardio', emoji: '🔥' },
  { name: 'Polichinelos', duration: '1 min', calories: '14 kcal', difficulty: 'Fácil', category: 'Cardio', emoji: '⛹️' },
  { name: 'Abdominal', duration: '1 min', calories: '10 kcal', difficulty: 'Fácil', category: 'Força', emoji: '🧘' },
  { name: 'Corrida no lugar', duration: '1 min', calories: '14 kcal', difficulty: 'Fácil', category: 'Cardio', emoji: '🏃' },
  { name: 'Jumping Squats', duration: '1 min', calories: '18 kcal', difficulty: 'Difícil', category: 'Força', emoji: '🦘' },
  { name: 'Escalada no Chão', duration: '1 min', calories: '16 kcal', difficulty: 'Difícil', category: 'Cardio', emoji: '🔥' },
];

export const WorkoutLibrary: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>(PRESET_EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) || 
    ex.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAISuggestion = async () => {
    setIsLoading(true);
    try {
      const result = await generateWorkouts(search || "treino variado", 15);
      if (result && result.exercises) {
        const newExercises: Exercise[] = result.exercises.map((ex: any) => ({
          name: ex.name,
          duration: ex.duration,
          calories: `${Math.floor(Math.random() * 20) + 5} kcal`,
          difficulty: ['Fácil', 'Médio', 'Difícil'][Math.floor(Math.random() * 3)] as any,
          category: 'Personalizado',
          emoji: ex.emoji || '✨'
        }));
        setExercises(prev => [...newExercises, ...prev]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-50 bg-[#fcfcfc] overflow-y-auto"
    >
      <AnimatePresence>
        {!selectedExercise ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-full max-w-5xl mx-auto"
          >
            {/* Header */}
            <header className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50">
              <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                  <Dumbbell size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Exercícios</h2>
              </div>
            </header>

            {/* Search Bar */}
            <div className="px-6 my-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar exercícios..."
                  className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium shadow-xs focus:ring-4 focus:ring-emerald-500/10 outline-hidden transition-all"
                />
                <button 
                  onClick={handleAISuggestion}
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
              </div>
            </div>

            {/* Exercise List */}
            <div className="px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-scrollbar">
              {filteredExercises.map((ex, i) => (
                <div key={`${ex.name}-${i}`} onClick={() => setSelectedExercise(ex)}>
                  <ExerciseCard exercise={ex} />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <WorkoutDetailView 
            exercise={selectedExercise} 
            onClose={() => setSelectedExercise(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WorkoutDetailView: React.FC<{ exercise: Exercise; onClose: () => void }> = ({ exercise, onClose }) => {
  const { updateAchievement } = useApp();
  const [minutes, setMinutes] = useState(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTimeLeft(minutes * 60);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            setIsFinished(true);
            updateAchievement('a10', 1, 'add');
            updateAchievement('a11', 1, 'add');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Fácil': return 'bg-emerald-50 text-emerald-500';
      case 'Médio': return 'bg-orange-50 text-orange-500';
      case 'Difícil': return 'bg-rose-50 text-rose-500';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-screen bg-white max-w-2xl mx-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-12 left-6 p-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="w-32 h-32 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 relative z-10"
              >
                <Trophy size={64} />
              </motion.div>
              
              {/* Confetti-like particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ 
                    x: Math.cos(i * 30 * Math.PI / 180) * 100,
                    y: Math.sin(i * 30 * Math.PI / 180) * 100,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-emerald-400"
                />
              ))}
            </div>

            <div className="space-y-3">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-slate-800"
              >
                Incrível!
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-500 font-bold text-lg"
              >
                Você concluiu {minutes} minutos de {exercise.name}.
              </motion.p>
            </div>

            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="mt-6 px-16 py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-3"
            >
              Concluir Desafio <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        ) : isTimerRunning ? (
          <motion.div 
            key="timer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="text-6xl font-black text-slate-800 tracking-tighter tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">{exercise.name}</h3>
              <p className="text-slate-400 font-medium mt-1">Mantenha o foco, você consegue!</p>
            </div>
            <button 
              onClick={() => setIsTimerRunning(false)}
              className="px-8 py-3 bg-rose-50 text-rose-500 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              Cancelar
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-sm space-y-12"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="text-7xl mb-2">{exercise.emoji}</div>
              <h2 className="text-4xl font-black text-slate-800">{exercise.name}</h2>
              <span className={cn(
                "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest",
                getDifficultyStyles(exercise.difficulty)
              )}>
                {exercise.difficulty}
              </span>
            </div>

            <div className="w-full space-y-8">
              <p className="text-center text-slate-400 font-medium">Escolha o tempo do exercício</p>
              
              <div className="flex items-center justify-center gap-12">
                <button 
                  onClick={() => setMinutes(Math.max(1, minutes - 1))}
                  className="w-16 h-16 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center active:scale-90 transition-all border border-slate-100"
                >
                  <Minus size={24} />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-black text-slate-800">{minutes}</span>
                  <span className="text-slate-400 font-bold text-sm">minuto{minutes > 1 ? 's' : ''}</span>
                </div>
                <button 
                  onClick={() => setMinutes(minutes + 1)}
                  className="w-16 h-16 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center active:scale-90 transition-all border border-slate-100"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {[1, 2, 3, 5, 10].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMinutes(m)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-xs font-black transition-all border",
                      minutes === m 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                        : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                    )}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={startTimer}
              className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-bold text-xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <Play size={24} fill="currentColor" /> Iniciar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Fácil': return 'bg-emerald-50 text-emerald-500';
      case 'Médio': return 'bg-orange-50 text-orange-500';
      case 'Difícil': return 'bg-rose-50 text-rose-500';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-5 border border-slate-50 shadow-xs flex items-center gap-4 relative group hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
    >
      <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-3xl shrink-0">
        {exercise.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-slate-800 text-base truncate pr-2">{exercise.name}</h4>
          <span className={cn(
            "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
            getDifficultyStyles(exercise.difficulty)
          )}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Clock size={12} className="text-slate-300" /> {exercise.duration}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Flame size={12} className="text-orange-400" /> {exercise.calories}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            {exercise.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};


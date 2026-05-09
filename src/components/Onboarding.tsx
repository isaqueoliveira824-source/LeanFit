import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Crown, Zap, Activity, Coffee, Salad, Fish, Apple, Wheat, Milk } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityLevel, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

export const Onboarding: React.FC = () => {
  const { completeOnboarding, user } = useApp();
  const [step, setStep] = useState(-1);
  const [formData, setFormData] = useState<Omit<UserProfile, 'onboardingComplete'>>({
    name: user?.name && user.name !== 'Membro' ? user.name : '',
    weight: 0,
    height: 0,
    goal: 'Emagrecer',
    foodPreferences: [],
    activityLevel: 'Sedentário',
    healthGoals: [],
    weightHistory: [],
    dietaryPreferences: [],
    dislikedIngredients: [],
  });

  // Re-sync name if user profile arrives late
  React.useEffect(() => {
    if (user?.name && !formData.name && user.name !== 'Membro') {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const foods = [
    { name: 'Carne', icon: <Coffee />, emoji: '🥩' },
    { name: 'Verduras', icon: <Salad />, emoji: '🥗' },
    { name: 'Peixe', icon: <Fish />, emoji: '🐟' },
    { name: 'Frutas', icon: <Apple />, emoji: '🍎' },
    { name: 'Grãos', icon: <Wheat />, emoji: '🌾' },
    { name: 'Laticínios', icon: <Milk />, emoji: '🥛' },
  ];

  const activityLevels: { level: ActivityLevel; label: string; description: string; icon: React.ReactNode }[] = [
    { level: 'Sedentário', label: 'Sedentário', description: 'Pouco ou nenhum exercício', icon: <Zap size={20} /> },
    { level: 'Levemente ativo', label: 'Levemente ativo', description: 'Exercício leve 1-3 dias/semana', icon: <Activity size={20} /> },
    { level: 'Moderadamente ativo', label: 'Moderadamente ativo', description: 'Exercício moderado 3-5 dias/semana', icon: <Activity size={20} /> },
    { level: 'Muito ativo', label: 'Muito ativo', description: 'Exercício intenso 6-7 dias/semana', icon: <Crown size={20} /> },
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      if (step === 4) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#ffffff']
        });
      }
    } else {
      completeOnboarding(formData);
    }
  };

  const handleBack = () => {
    if (step > -1) setStep(step - 1);
  };

  const toggleFood = (food: string) => {
    setFormData(prev => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(food)
        ? prev.foodPreferences.filter(f => f !== food)
        : [...prev.foodPreferences, food]
    }));
  };

  const currentStep = () => {
    switch (step) {
      case -1:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center space-y-8 py-10"
          >
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
               <span className="text-6xl animate-bounce">🥗</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight gradient-text">
                Seja Bem-vindo ao <br />Lean Fit 💚
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto leading-relaxed">
                Estamos felizes em ter você aqui! Vamos preparar seu plano personalizado agora mesmo.
              </p>
            </div>
          </motion.div>
        );
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Qual é o seu nome?</h2>
              <p className="text-slate-500">Gostariamos de saber como te chamar.</p>
            </div>
            <input 
              type="text"
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite seu nome"
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all shadow-sm"
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Qual é o seu peso atual? (kg)</h2>
              <p className="text-slate-500">Para calcularmos seu IMC e necessidades calóricas.</p>
            </div>
            <input 
              type="number"
              step="0.1"
              autoFocus
              value={formData.weight || ''}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              placeholder="Digite seu peso em kg"
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all shadow-sm"
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Qual é a sua altura? (cm)</h2>
              <p className="text-slate-500">Use centímetros (ex: 175).</p>
            </div>
            <input 
              type="number"
              autoFocus
              value={formData.height || ''}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              placeholder="Digite sua altura em cm"
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all shadow-sm"
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Quais alimentos você prefere?</h2>
              <p className="text-slate-500">Selecione todos que você gosta.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {foods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => toggleFood(food.name)}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2",
                    formData.foodPreferences.includes(food.name)
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                  )}
                >
                  <span className="text-3xl">{food.emoji}</span>
                  <span className="font-semibold text-sm">{food.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Qual é o seu nível de atividade?</h2>
              <p className="text-slate-500">Seja sincero para resultados reais.</p>
            </div>
            <div className="space-y-3">
              {activityLevels.map((act) => (
                <button
                  key={act.level}
                  onClick={() => setFormData({ ...formData, activityLevel: act.level })}
                  className={cn(
                    "w-full flex items-center p-4 rounded-2xl border-2 transition-all gap-4 text-left",
                    formData.activityLevel === act.level
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    formData.activityLevel === act.level ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {act.icon}
                  </div>
                  <div>
                    <h4 className="font-bold">{act.label}</h4>
                    <p className="text-xs opacity-70">{act.description}</p>
                  </div>
                  {formData.activityLevel === act.level && (
                    <Check size={18} className="ml-auto text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-10"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-200 ring-8 ring-emerald-50">
              <Check size={48} strokeWidth={3} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight">Perfeito! 🎯</h2>
              <p className="text-slate-500 text-lg">
                Agora já sabemos mais sobre você.<br />
                Seu plano personalizado está pronto.
              </p>
            </div>
            <div className="bg-slate-100 p-6 rounded-3xl text-sm font-medium text-slate-600 inline-block">
              Vamos começar sua transformação agora mesmo.
            </div>
          </motion.div>
        );
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !formData.name;
    if (step === 1) return !formData.weight;
    if (step === 2) return !formData.height;
    if (step === 3) return formData.foodPreferences.length === 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center p-6 pt-20 md:pt-32">
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
        {step >= 0 && step < 5 ? (
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={handleBack}
              disabled={step === 0}
              className={cn(
                "p-3 rounded-full transition-all",
                step === 0 ? "opacity-0 invisible" : "hover:bg-slate-200 text-slate-600"
              )}
            >
              <ArrowLeft size={28} />
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    i === step ? "w-10 bg-emerald-500" : i < step ? "w-2 bg-emerald-300" : "w-2 bg-slate-200"
                  )} 
                />
              ))}
            </div>
            <div className="w-10 md:w-14" />
          </div>
        ) : (
          <div className={cn("mb-8", step === -1 && "mb-0")} />
        )}

        <div className="min-h-[440px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            {currentStep()}
          </AnimatePresence>
        </div>

        <div className="mt-12 md:max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={cn(
              "w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg",
              isNextDisabled() 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "btn-gradient hover:shadow-xl hover:shadow-emerald-200"
            )}
          >
            {step === -1 ? 'Vamos começar' : step === 5 ? 'Começar agora' : 'Próximo'}
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};


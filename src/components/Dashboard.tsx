import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Utensils, Dumbbell, Apple, Scan, Box, 
  Droplets, Timer, Trophy, Target, TrendingUp, 
  Plus, ChevronRight, Calculator, PieChart, Zap, Sparkles,
  MessageSquare, User, Heart, ShoppingCart, 
  Star, Clock, Refrigerator, LogOut, Bot, BookOpen, Camera, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { getMotivationOfTheDay } from '../constants/motivations';
import { generateDailyMotivation } from '../services/gemini';

// Modals
import { Scanner } from './Scanner';
import { ChatIA } from './ChatIA';
import { RecipeLibrary } from './RecipeLibrary';
import { WorkoutLibrary } from './WorkoutLibrary';
import { DietPlan } from './DietPlan';
import { Evaluation } from './Evaluation';
import { ChallengesAchievements } from './ChallengesAchievements';
import { FastingTracker } from './FastingTracker';
import { ShoppingList } from './ShoppingList';
import { WaterTracker } from './WaterTracker';
import { Profile } from './Profile';

export const Dashboard: React.FC = () => {
  const { user, logout, waterIntake, waterGoal, addWater } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  
  // Modal states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);
  const [isDietOpen, setIsDietOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [challengesInitialTab, setChallengesInitialTab] = useState<'challenges' | 'achievements'>('challenges');
  const [isFastingOpen, setIsFastingOpen] = useState(false);
  const [isEvalOpen, setIsEvalOpen] = useState(false);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const [isWaterOpen, setIsWaterOpen] = useState(false);

  const [motivation, setMotivation] = useState(getMotivationOfTheDay());
  const [isGeneratingMotivation, setIsGeneratingMotivation] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  React.useEffect(() => {
    const lastMotivationDate = localStorage.getItem('last_motivation_date');
    const today = new Date().toLocaleDateString();

    if (lastMotivationDate !== today) {
      handleRefreshMotivation().then(() => {
        localStorage.setItem('last_motivation_date', today);
      });
    }
  }, []);

  const handleRefreshMotivation = async () => {
    setIsGeneratingMotivation(true);
    const newMotivation = await generateDailyMotivation();
    if (newMotivation) setMotivation(newMotivation);
    setIsGeneratingMotivation(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center overflow-y-auto scrollbar-hide pb-24 lg:pb-8">
      {/* Header Section */}
      <header className="w-full max-w-4xl px-6 py-6 flex items-center justify-between z-50 bg-white md:bg-transparent md:shadow-none md:mt-2">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-slate-400 text-xs font-medium">{getGreeting()},</span>
            <h1 className="text-lg md:text-2xl font-black text-slate-900 leading-tight flex items-center gap-1">
              {user?.name || 'Membro'} 👋
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('profile')} 
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform"
          >
            <span className="font-bold text-lg md:text-xl leading-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-1 py-6 pb-20 md:pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Motivation, Water and Quick Actions */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                  {/* Daily Motivation */}
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-5 flex items-center justify-between shadow-sm">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-primary-green font-bold text-xs uppercase tracking-widest leading-tight italic mb-1">Motivação do Dia</h3>
                      <p className="text-sm md:text-base font-medium text-slate-700 leading-tight">
                         🌟 {motivation}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className="text-primary-green p-1 ml-3 active:scale-125 transition-transform"
                    >
                      <Heart size={24} fill={isLiked ? "currentColor" : "none"} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Water Section */}
                  <div 
                    onClick={() => setIsWaterOpen(true)}
                    className="bg-white border border-slate-100 rounded-[2rem] p-5 flex items-center justify-between shadow-sm cursor-pointer hover:border-sky-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                        <Droplets size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-800">Água</span>
                          <span className="text-xs font-bold text-sky-400">{(waterIntake / 200).toFixed(0)} / 10 copos</span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                             className="h-full bg-sky-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addWater(200);
                      }}
                      className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center active:scale-90 transition-all ml-4 shrink-0 shadow-lg shadow-black/10"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>

                {/* Main Feature Cards - Now Grid Responsive */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsScannerOpen(true)}
                    className="bg-linear-to-br from-emerald-400 to-primary-green text-white p-6 rounded-[2.5rem] flex items-center gap-6 text-left shadow-lg shadow-emerald-500/20 relative overflow-hidden active:scale-[0.98] transition-all group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Camera size={38} />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h4 className="font-black text-lg md:text-xl leading-tight uppercase italic text-white mb-1">
                        Analisar Refeição
                      </h4>
                      <p className="text-xs md:text-sm text-white/80 font-medium tracking-tight">Escaneie sua comida agora</p>
                    </div>
                    <ChevronRight size={24} className="text-white/60 ml-auto" />
                  </button>

                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-linear-to-br from-sky-400 to-primary-blue text-white p-6 rounded-[2.5rem] flex items-center gap-6 text-left shadow-lg shadow-sky-500/20 relative overflow-hidden active:scale-[0.98] transition-all group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <MessageSquare size={38} />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h4 className="font-black text-lg md:text-xl leading-tight uppercase italic text-white mb-1">Chat IA</h4>
                      <p className="text-xs md:text-sm text-white/80 font-medium tracking-tight">Tire dúvidas agora</p>
                    </div>
                    <ChevronRight size={24} className="text-white/60 ml-auto" />
                  </button>
                </div>

                {/* Action Grid - Responsive columns */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <DashboardGridItem 
                    icon={<Utensils />} color="text-emerald-500" bgColor="bg-emerald-50" 
                    label="Dieta" desc="Planos personalizados" onClick={() => setIsDietOpen(true)} 
                  />
                  <DashboardGridItem 
                    icon={<BookOpen />} color="text-orange-500" bgColor="bg-orange-50" 
                    label="Receitas" desc="Deliciosas e saudáveis" onClick={() => setIsRecipesOpen(true)} 
                  />
                  <DashboardGridItem 
                    icon={<Dumbbell />} color="text-emerald-500" bgColor="bg-emerald-50" 
                    label="Treinos" desc="Exercícios para você" onClick={() => setIsWorkoutOpen(true)} 
                  />
                  
                  <DashboardGridItem 
                    icon={<Clock />} color="text-emerald-500" bgColor="bg-emerald-50" 
                    label="Jejum" desc="Acompanhe seu jejum" onClick={() => setIsFastingOpen(true)} 
                  />
                  <DashboardGridItem 
                    icon={<Target />} color="text-emerald-500" bgColor="bg-emerald-50" 
                    label="Desafios" desc="Supere seus limites" onClick={() => {
                      setChallengesInitialTab('challenges');
                      setIsChallengesOpen(true);
                    }} 
                  />
                  <DashboardGridItem 
                    icon={<ShoppingCart />} color="text-sky-500" bgColor="bg-sky-50" 
                    label="Compras" desc="Lista de alimentos" onClick={() => setIsShoppingOpen(true)} 
                  />
                  
                  <DashboardGridItem 
                    icon={<Refrigerator />} color="text-sky-500" bgColor="bg-sky-50" 
                    label="Geladeira" desc="Receitas com o que tem" onClick={() => setIsFridgeOpen(true)} 
                  />
                  <DashboardGridItem 
                    icon={<Trophy />} color="text-orange-500" bgColor="bg-orange-50" 
                    label="Conquistas" desc="0/5 desbloqueadas" onClick={() => {
                      setChallengesInitialTab('achievements');
                      setIsChallengesOpen(true);
                    }} 
                  />
                  <DashboardGridItem 
                    icon={<Star />} color="text-yellow-500" bgColor="bg-yellow-50" 
                    label="Avaliar o App" desc="Nos dê sua opinião" onClick={() => setIsEvalOpen(true)} 
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full px-6"
            >
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 md:bottom-6 left-1/2 -translate-x-1/2 w-full md:max-w-xl z-40 bg-white md:bg-white/80 md:backdrop-blur-xl border-t md:border border-slate-100 md:rounded-[2.5rem] p-3 pb-8 md:pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] md:shadow-xl md:shadow-slate-200/50">
        <nav className="flex items-center justify-around">
          <BottomNavItem active={activeTab === 'home'} label="Início" icon={<Home />} onClick={() => setActiveTab('home')} />
          <BottomNavItem active={activeTab === 'diet'} label="Dieta" icon={<Utensils />} onClick={() => setIsDietOpen(true)} />
          <BottomNavItem active={activeTab === 'workout'} label="Treinos" icon={<Activity />} onClick={() => setIsWorkoutOpen(true)} />
          <BottomNavItem active={activeTab === 'water'} label="Água" icon={<Droplets />} onClick={() => setIsWaterOpen(true)} />
          <BottomNavItem active={activeTab === 'profile'} label="Perfil" icon={<User />} onClick={() => setActiveTab('profile')} />
        </nav>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isScannerOpen && <Scanner onClose={() => setIsScannerOpen(false)} />}
        {isChatOpen && <ChatIA onClose={() => setIsChatOpen(false)} />}
        {isRecipesOpen && <RecipeLibrary onClose={() => setIsRecipesOpen(false)} />}
        {isFridgeOpen && <RecipeLibrary onClose={() => setIsFridgeOpen(false)} isFridge={true} />}
        {isWorkoutOpen && <WorkoutLibrary onClose={() => setIsWorkoutOpen(false)} />}
        {isDietOpen && <DietPlan onClose={() => setIsDietOpen(false)} />}
        {isChallengesOpen && (
          <ChallengesAchievements 
            initialTab={challengesInitialTab} 
            onClose={() => setIsChallengesOpen(false)} 
          />
        )}
        {isFastingOpen && <FastingTracker onClose={() => setIsFastingOpen(false)} />}
        {isEvalOpen && <Evaluation onClose={() => setIsEvalOpen(false)} />}
        {isShoppingOpen && <ShoppingList onClose={() => setIsShoppingOpen(false)} />}
        {isWaterOpen && <WaterTracker onClose={() => setIsWaterOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

const DashboardGridItem: React.FC<{ icon: React.ReactNode; color: string; bgColor: string; label: string; desc: string; onClick: () => void }> = ({ icon, color, bgColor, label, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white border border-slate-100 rounded-[2rem] p-5 flex flex-col items-center text-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all active:scale-95 group"
  >
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", bgColor, color)}>
      {React.cloneElement(icon as React.ReactElement, { size: 28 })}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-bold text-slate-800 leading-tight">{label}</p>
      <p className="text-[10px] font-medium text-slate-400 leading-tight px-1">{desc}</p>
    </div>
  </button>
);

const BottomNavItem: React.FC<{ active: boolean; label: string; icon: React.ReactNode; onClick: () => void }> = ({ active, label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1.5 transition-all active:scale-95 px-2",
      active ? "text-primary-green" : "text-slate-300"
    )}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 22 })}
    <span className={cn("text-[10px] font-bold", active ? "text-primary-green" : "text-slate-400")}>{label}</span>
  </button>
);

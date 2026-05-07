import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Target, CheckCircle2, ChevronRight, Clock, Flame, Zap, Award, Info, Play, ArrowLeft, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  duration: string;
  category: 'Nutrição' | 'Fitness' | 'Hábitos';
  icon: string;
  tips: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Início' | 'Consistência' | 'Alimentação' | 'Treinos' | 'Evolução';
  current: number;
  total: number;
  status: 'locked' | 'progress' | 'completed';
}

const CHALLENGES: Challenge[] = [
  { id: '1', title: 'Desafio 7 Dias Sem Açúcar', description: 'Elimine o açúcar refinado por 7 dias.', difficulty: 'Médio', duration: '7 dias', category: 'Nutrição', icon: '🍬', tips: ['Leia o rótulos dos alimentos processados.', 'Troque doces por frutas naturais.', 'Evite refrigerantes e sucos de caixa.'] },
  { id: '2', title: 'Perder 2kg em 14 Dias', description: 'Déficit calórico saudável com exercícios.', difficulty: 'Difícil', duration: '14 dias', category: 'Fitness', icon: '⚖️', tips: ['Mantenha um diário alimentar.', 'Reduza porções de carboidratos.', 'Aumente o consumo de água.'] },
  { id: '3', title: '30 Dias de Hidratação', description: 'Beba a quantidade ideal todos os dias.', difficulty: 'Fácil', duration: '30 dias', category: 'Hábitos', icon: '💧', tips: ['Tenha sempre uma garrafa com você.', 'Use um aplicativo de lembrete.', 'Comece o dia bebendo 500ml de água.'] },
  { id: '4', title: '21 Dias Sem Fast Food', description: 'Cozinhe em casa por 3 semanas.', difficulty: 'Médio', duration: '21 dias', category: 'Nutrição', icon: '🍔', tips: ['Planeje seu cardápio semanal.', 'Faça compras saudáveis aos domingos.', 'Descubra novas receitas caseiras.'] },
];

export const ChallengesAchievements: React.FC<{ 
  onClose: () => void;
  initialTab?: 'challenges' | 'achievements';
}> = ({ onClose, initialTab = 'challenges' }) => {
  const { achievements } = useApp();
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements'>(initialTab);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const filteredChallenges = CHALLENGES.filter(c => 
    selectedFilter === 'Todos' || c.category === selectedFilter
  );

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenges(prev => [...prev, challenge.id]);
    setMessage(`🚀 Desafio ${challenge.title} iniciado! Boa sorte!`);
    setTimeout(() => setMessage(null), 3000);
    setSelectedChallenge(null);
  };

  const completeChallenge = (challenge: Challenge) => {
    setActiveChallenges(prev => prev.filter(id => id !== challenge.id));
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    setMessage(`O Desafio ${challenge.title} foi concluído com sucesso, bom trabalho 🚀`);
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto"
    >
      {/* Status Messages */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 50 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <Zap className="text-emerald-400 shrink-0" size={24} />
            <p className="text-sm font-bold leading-tight">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="px-4 py-4 bg-white flex flex-col gap-4 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Trophy size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 Rewards</h2>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('achievements')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === 'achievements' ? "bg-white text-slate-800 shadow-xs" : "text-slate-400"
              )}
            >
              Conquistas
            </button>
            <button 
              onClick={() => setActiveTab('challenges')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === 'challenges' ? "bg-white text-slate-800 shadow-xs" : "text-slate-400"
              )}
            >
              Desafios
            </button>
          </div>
        </div>
        
        {/* Filters - Only for challenges */}
        {activeTab === 'challenges' && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 px-2">
            {['Todos', 'Nutrição', 'Fitness', 'Hábitos'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold transition-all border shrink-0",
                  selectedFilter === f 
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="px-6 py-8 space-y-4 pb-12 max-w-md mx-auto w-full">
        {activeTab === 'challenges' ? (
          <div className="space-y-4">
            {filteredChallenges.map((c) => (
              <motion.div 
                key={c.id} 
                layoutId={c.id}
                onClick={() => setSelectedChallenge(c)}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-center gap-5 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{c.title}</h3>
                  <p className="text-slate-400 text-xs font-medium mb-3">{c.description}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{c.duration}</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                      c.difficulty === 'Fácil' ? "bg-emerald-100 text-emerald-600" :
                      c.difficulty === 'Médio' ? "bg-amber-100 text-amber-600" :
                      "bg-rose-100 text-rose-600"
                    )}>
                      {c.difficulty}
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{c.category}</span>
                  </div>
                </div>
                {activeChallenges.includes(c.id) && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Play size={12} fill="currentColor" className="ml-0.5 animate-pulse" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Achievement Categories */}
            {(['Início', 'Consistência', 'Alimentação', 'Treinos', 'Evolução'] as const).map(cat => (
              <div key={cat} className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">{cat}</h3>
                <div className="space-y-3">
                  {achievements.filter(a => a.category === cat).map(a => (
                    <motion.div 
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "bg-white rounded-[2rem] p-5 border transition-all relative overflow-hidden",
                        a.status === 'completed' ? "border-emerald-100 bg-emerald-50/20" : "border-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-5 relative z-10">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all",
                          a.status === 'completed' ? "bg-white scale-110 shadow-emerald-200" : 
                          a.status === 'locked' ? "bg-slate-100 grayscale opacity-50" : "bg-white"
                        )}>
                          {a.status === 'locked' ? '🔒' : a.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={cn(
                              "text-base font-black leading-tight",
                              a.status === 'completed' ? "text-emerald-600" : "text-slate-800"
                            )}>
                              {a.name}
                            </h4>
                            {a.status === 'completed' ? (
                              <CheckCircle2 size={18} className="text-emerald-500" />
                            ) : (
                              <span className="text-[10px] font-black text-slate-400">
                                {a.current}/{a.total}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-[10px] font-medium mb-3">{a.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(a.current / a.total) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full",
                                a.status === 'completed' ? "bg-emerald-500" : "bg-sky-500"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Shine effect for completed */}
                      {a.status === 'completed' && (
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-white flex flex-col overflow-y-auto"
          >
            <header className="px-4 py-4 flex items-center gap-3 sticky top-0 bg-white border-b border-slate-50 z-10">
              <button 
                onClick={() => setSelectedChallenge(null)}
                className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-lg font-bold text-slate-800">Detalhes do Desafio</h2>
            </header>

            <div className="px-6 space-y-8 max-w-md mx-auto w-full pb-32">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center text-6xl shadow-xl shadow-emerald-500/10">
                  {selectedChallenge.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                    {selectedChallenge.title}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      {selectedChallenge.category}
                    </span>
                    <span className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      selectedChallenge.difficulty === 'Fácil' ? "bg-emerald-100 text-emerald-600" :
                      selectedChallenge.difficulty === 'Médio' ? "bg-amber-100 text-amber-600" :
                      "bg-rose-100 text-rose-600"
                    )}>
                      {selectedChallenge.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Info size={24} />
                  <h4 className="font-black text-lg">Dicas para Concluir</h4>
                </div>
                <ul className="space-y-3">
                  {selectedChallenge.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <p className="text-sm font-medium leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fixed bottom-10 left-0 right-0 px-6 max-w-md mx-auto">
                {activeChallenges.includes(selectedChallenge.id) ? (
                  <button 
                    onClick={() => completeChallenge(selectedChallenge)}
                    className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                  >
                    <CheckCircle2 size={24} /> Concluir Desafio
                  </button>
                ) : (
                  <button 
                    onClick={() => startChallenge(selectedChallenge)}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    <Play size={24} fill="currentColor" /> Começar Desafio
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

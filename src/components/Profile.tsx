import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Settings, ChevronRight, Target, 
  Apple, X, Plus, Scale, Ruler, Activity, Heart,
  Save, LogOut, Trash2, Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout, updateAchievement } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newDislike, setNewDislike] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const [newPreference, setNewPreference] = useState('');

  if (!user || !editedUser) return null;

  const handleSave = () => {
    updateProfile(editedUser);
    updateAchievement('a13', 1, 'set');
    setIsEditing(false);
  };

  const addPreference = () => {
    if (newPreference && !(editedUser.foodPreferences || []).includes(newPreference)) {
      setEditedUser({
        ...editedUser,
        foodPreferences: [...(editedUser.foodPreferences || []), newPreference]
      });
      setNewPreference('');
    }
  };

  const removePreference = (pref: string) => {
    setEditedUser({
      ...editedUser,
      foodPreferences: (editedUser.foodPreferences || []).filter(p => p !== pref)
    });
  };

  const addDislike = () => {
    if (newDislike && !(editedUser.dislikedIngredients || []).includes(newDislike)) {
      setEditedUser({
        ...editedUser,
        dislikedIngredients: [...(editedUser.dislikedIngredients || []), newDislike]
      });
      setNewDislike('');
    }
  };

  const removeDislike = (item: string) => {
    setEditedUser({
      ...editedUser,
      dislikedIngredients: (editedUser.dislikedIngredients || []).filter(i => i !== item)
    });
  };

  const addHealthGoal = () => {
    if (newGoal && !(editedUser.healthGoals || []).includes(newGoal)) {
      setEditedUser({
        ...editedUser,
        healthGoals: [...(editedUser.healthGoals || []), newGoal]
      });
      setNewGoal('');
    }
  };

  const removeHealthGoal = (goal: string) => {
    setEditedUser({
      ...editedUser,
      healthGoals: (editedUser.healthGoals || []).filter(g => g !== goal)
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 pb-32 max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl md:rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-white text-2xl md:text-4xl font-bold shadow-lg shadow-emerald-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">{user.name}</h2>
            <p className="text-emerald-600 text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-1 italic">Membro 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁</p>
          </div>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={cn(
            "p-3 md:p-4 rounded-2xl transition-all active:scale-95 shadow-sm border",
            isEditing ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
          )}
        >
          {isEditing ? <Save size={24} /> : <Settings size={24} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Stats Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 grid grid-cols-2 gap-8 shadow-sm h-full">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Scale size={20} className="text-emerald-500" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Peso Atual</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                value={editedUser.weight}
                onChange={(e) => setEditedUser({...editedUser, weight: parseFloat(e.target.value)})}
                className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-4xl md:text-5xl font-black text-slate-900">{user.weight}<span className="text-sm font-bold text-slate-400 ml-1">KG</span></p>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Ruler size={20} className="text-emerald-500" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Altura</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                value={editedUser.height}
                onChange={(e) => setEditedUser({...editedUser, height: parseInt(e.target.value)})}
                className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-4xl md:text-5xl font-black text-slate-900">{user.height}<span className="text-sm font-bold text-slate-400 ml-1">CM</span></p>
            )}
          </div>
        </div>

        {/* Goal Selection */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm h-full">
          <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
            <Target size={18} className="text-sky-500" />
            OBJETIVO PRINCIPAL
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {['Emagrecer', 'Ganhar Massa', 'Manter Peso', 'Definição'].map((g) => (
              <button
                key={g}
                disabled={!isEditing}
                onClick={() => setEditedUser({...editedUser, goal: g})}
                className={cn(
                  "py-4 px-4 rounded-2xl text-xs font-black border-2 transition-all italic uppercase tracking-wider",
                  editedUser.goal === g 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm" 
                    : "bg-slate-50 border-transparent text-slate-400"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Health Goals Section */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
          <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
             <Activity size={18} className="text-emerald-500" />
             METAS DE SAÚDE
          </h3>
          <div className="space-y-3">
            {(editedUser.healthGoals || []).map((goal, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl group/goal">
                <span className="text-sm font-bold text-slate-800">{goal}</span>
                {isEditing && (
                  <button onClick={() => removeHealthGoal(goal)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
               <div className="flex gap-2 mt-4">
                 <input 
                   type="text" 
                   value={newGoal}
                   onChange={(e) => setNewGoal(e.target.value)}
                   placeholder="Ex: Treinar 4x/semana"
                   className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                 />
                 <button 
                   onClick={addHealthGoal}
                   className="w-14 h-14 bg-emerald-500 text-white rounded-2xl active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0"
                 >
                   <Plus size={28} strokeWidth={3} />
                 </button>
               </div>
            )}
          </div>
        </div>

        {/* Food Preferences & Dislikes */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
              <Apple size={18} className="text-emerald-500" />
              PREFERÊNCIAS ALIMENTARES
            </h3>
            <div className="flex flex-wrap gap-2">
              {(editedUser.foodPreferences || []).map(pref => (
                <div key={pref} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-black italic transition-all">
                  {pref}
                  {isEditing && (
                    <button onClick={() => removePreference(pref)}>
                      <X size={14} strokeWidth={3} className="hover:text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-1 items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 min-w-[120px]">
                  <input 
                    type="text" 
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="ADC..."
                    className="bg-transparent border-none text-xs font-bold px-2 w-full focus:outline-none text-slate-900 placeholder-slate-400"
                    onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                  />
                  <button onClick={addPreference} className="text-emerald-500"><Plus size={18} strokeWidth={3} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-8">
            <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
              <X size={18} className="text-red-400" />
              RESTRIÇÕES OU DESGOSTOS
            </h3>
            <div className="flex flex-wrap gap-2">
              {(editedUser.dislikedIngredients || []).map(item => (
                <div key={item} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-black italic transition-all">
                  {item}
                  {isEditing && (
                    <button onClick={() => removeDislike(item)}>
                      <X size={14} strokeWidth={3} className="hover:text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-1 items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 min-w-[120px]">
                  <input 
                    type="text" 
                    value={newDislike}
                    onChange={(e) => setNewDislike(e.target.value)}
                    placeholder="ADC..."
                    className="bg-transparent border-none text-xs font-bold px-2 w-full focus:outline-none text-slate-900 placeholder-slate-400"
                    onKeyPress={(e) => e.key === 'Enter' && addDislike()}
                  />
                  <button onClick={addDislike} className="text-emerald-500"><Plus size={18} strokeWidth={3} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="mt-12 space-y-6 flex flex-col items-center">
         <button 
           onClick={logout}
           className="w-full md:max-w-md py-6 bg-red-50 text-red-600 border border-red-100 rounded-[2.5rem] font-black text-base uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-red-500 hover:text-white group shadow-sm"
         >
           <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
           SAIR DA CONTA
         </button>
         <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] italic">𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 v4.0.0 • PEAK PERFORMANCE ⚡</p>
      </div>
    </motion.div>
  );
};

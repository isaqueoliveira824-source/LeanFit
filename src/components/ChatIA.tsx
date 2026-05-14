import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User, Loader2, Sparkles, History, Trash2, ChevronLeft } from 'lucide-react';
import { chatLeanAI } from '../services/gemini';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const ChatIA: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useApp();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Olá! Eu sou sua Nutricionista IA. Como posso ajudar na sua alimentação hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Posso comer pão na dieta?",
    "Quantas calorias tem um ovo?",
    "Qual melhor lanche pré-treino?",
    "Posso comer fruta à noite?",
    "Arroz integral ou branco?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatLeanAI(userMessage, user || {}, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Desculpe, não entendi.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Tive um problema de conexão. Tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isInitialState = messages.length === 1 && !isLoading;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      {/* Header */}
      <header translate="no" className="px-4 py-4 bg-white flex items-center gap-3 border-b border-slate-50">
        <button onClick={onClose} className="p-2 text-slate-600 active:scale-95 transition-transform flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Nutricionista IA</h2>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-6 pb-32 max-w-2xl mx-auto w-full min-h-[calc(100vh-80px)]">
        {isInitialState ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-sky-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-sky-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent" />
              <Bot size={48} className="relative z-10" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-700">Pergunte qualquer coisa sobre nutrição!</h3>
            </div>

            <div className="w-full space-y-3">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-600 hover:bg-sky-50 hover:border-sky-100 transition-all text-left shadow-sm active:scale-[0.98]"
                >
                  <div translate="no" className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                    <Sparkles size={14} />
                  </div>
                  <span translate="no" className="text-sm font-medium">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-24">
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-3",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  m.role === 'model' ? "bg-sky-500 text-white" : "bg-emerald-500 text-white"
                )}>
                  {m.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                  m.role === 'model' 
                    ? "bg-slate-50 text-slate-800 border border-slate-100" 
                    : "bg-sky-500 text-white shadow-md shadow-sky-500/10"
                )}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Loader2 size={18} className="animate-spin text-sky-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Field Area */}
      <div translate="no" className="fixed bottom-0 left-0 right-0 p-6 bg-white shadow-2xl border-t border-slate-50">
        <div className="max-w-2xl mx-auto relative flex items-center gap-3">
          <div className="relative flex-1">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Pergunte sobre nutrição..."
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-sky-500/20 outline-hidden transition-all placeholder:text-slate-400"
            />
          </div>
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-lg",
              input.trim() && !isLoading ? "bg-sky-600 text-white shadow-sky-600/30 active:scale-95" : "bg-slate-100 text-slate-300 shadow-none"
            )}
          >
            <Send size={24} className={cn(isLoading && "animate-pulse")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, Info, Trophy, Zap, AlertCircle, User, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';

export const AuthScreen: React.FC = () => {
  const { login } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(false);
  };

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Verifique seu e-mail para redefinir a senha.');
      setTimeout(() => setMode('login'), 5000);
    } catch (err: any) {
      setError(err.message.includes('auth/user-not-found') 
        ? 'E-mail não encontrado.' 
        : 'Erro ao enviar e-mail de redefinição.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      handleForgotPassword(e);
      return;
    }

    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        await firebaseUpdateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      }
    } catch (err: any) {
      console.error('Auth Error Details:', {
        code: err.code,
        message: err.message,
        mode
      });
      
      const errorCode = err.code || '';
      
      if (errorCode === 'auth/invalid-credential' || 
          errorCode === 'auth/user-not-found' || 
          errorCode === 'auth/wrong-password' ||
          err.message?.includes('invalid-credential')) {
        
        if (mode === 'login') {
          setError('E-mail ou senha incorretos. Caso ainda não tenha uma conta, clique em "CRIAR CONTA" acima.');
        } else {
          setError('Ocorreu um erro nas credenciais informadas. Verifique os dados e tente novamente.');
        }
      } else if (errorCode === 'auth/invalid-email') {
        setError('O formato do e-mail é inválido. Exemplo: seu@email.com');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Sua senha deve ser mais forte (mínimo de 6 caracteres).');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Acesso bloqueado temporariamente por excesso de tentativas. Tente novamente em alguns minutos.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Erro de conexão. Verifique se você está conectado à internet.');
      } else {
        setError(`Ops! ${err.message || 'Houve um problema ao processar seu acesso. Tente novamente.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-light relative overflow-hidden">
      {/* Background soft glows - More dynamic for desktop */}
      <div className="absolute -top-24 -left-24 w-96 md:w-[600px] h-96 md:h-[600px] bg-primary-green/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 md:w-[600px] h-96 md:h-[600px] bg-primary-blue/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md md:max-w-lg z-10"
      >
        <div className="text-center mb-10">
          <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-3">𝗕𝗲𝗺 𝘃𝗶𝗻𝗱𝗼!</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter gradient-text mb-4">𝗟𝗲𝗮𝗻 𝗙𝗶𝘁</h1>
          <p className="text-slate-500 font-bold tracking-wide leading-relaxed md:text-lg">
            𝗥𝗲𝗰𝗲𝗶𝘁𝗮𝘀 • 𝗗𝗶𝗲𝘁𝗮𝘀 • 𝗧𝗿𝗲𝗶𝗻𝗼𝘀<br />
            𝗲 𝗺𝘂𝗶𝘁𝗼 𝗺𝗮𝗶𝘀 💚
          </p>
        </div>

        <div className="glass p-8 md:p-12 rounded-[40px] md:rounded-[60px] shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-md border border-white/20">
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 border border-slate-200">
            <button 
              onClick={() => handleModeChange('login')}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all italic",
                mode === 'login' ? "bg-white text-primary-green shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              LOGIN
            </button>
            <button 
              onClick={() => handleModeChange('signup')}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all italic",
                mode === 'signup' ? "bg-white text-primary-green shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              CRIAR CONTA
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2 italic">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold animate-in fade-in slide-in-from-top-2 italic">
                <Zap size={18} />
                {successMessage}
              </div>
            )}

            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 italic">NOME COMPLETO</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Isaque Oliveira"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-green/10 focus:border-primary-green outline-hidden transition-all text-sm font-medium text-slate-900"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 italic">E-MAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-green/10 focus:border-primary-green outline-hidden transition-all text-sm font-medium text-slate-900"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 italic">SENHA</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-green/10 focus:border-primary-green outline-hidden transition-all text-sm font-medium text-slate-900"
                    required={mode !== 'forgot'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-green transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => handleModeChange('forgot')}
                  className="text-xs font-bold text-primary-blue hover:text-primary-green transition-all italic uppercase tracking-wider"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => handleModeChange('login')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all italic uppercase tracking-wider"
                >
                  Voltar para o Login
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 btn-gradient rounded-2xl text-lg flex items-center justify-center gap-3 font-black italic uppercase"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'forgot' ? <Mail size={20} /> : mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {mode === 'forgot' ? 'ENVIAR LINK' : mode === 'login' ? 'COMEÇAR' : 'CRIAR MINHA CONTA'}
                </>
              )}
            </button>

          </form>

          {mode === 'signup' && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-primary-green/5 border border-primary-green/10 rounded-2xl">
              <Zap className="text-primary-green shrink-0" size={18} />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Ao criar sua conta, você terá acesso imediato a todas as ferramentas de inteligência nutricional do 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

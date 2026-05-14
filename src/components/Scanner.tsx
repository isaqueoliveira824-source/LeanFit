import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, X, Loader2, Sparkles, CheckCircle2, AlertTriangle, XCircle, Info, ChevronRight, Apple, ChevronLeft, Upload } from 'lucide-react';
import { analyzeFood, FoodAnalysis } from '../services/gemini';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

export const Scanner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { updateAchievement } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Seu navegador não suporta acesso à câmera ou a conexão não é segura (precisa de HTTPS).");
      return;
    }

    try {
      setIsCameraActive(true);
      // O stream será iniciado pelo useEffect quando o vídeo for montado
    } catch (err: any) {
      console.error("Erro ao iniciar processo da câmera:", err);
      setError("Não foi possível iniciar a câmera.");
    }
  };

  // Efeito para gerenciar o stream da câmera quando o visor estiver ativo
  React.useEffect(() => {
    let currentStream: MediaStream | null = null;

    const setupCamera = async () => {
      if (isCameraActive && videoRef.current) {
        try {
          const constraints = {
            video: { facingMode: { ideal: 'environment' } }
          };
          
          currentStream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = currentStream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }
        } catch (err: any) {
          console.error("Erro ao acessar hardware da câmera:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'DOMException') {
            setError("Acesso negado. Certifique-se de permitir a câmera no seu navegador.");
          } else {
            setError("Não foi possível carregar a câmera externa.");
          }
          setIsCameraActive(false);
        }
      }
    };

    setupCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
        processImage(dataUrl);
      }
    }
  };

  const compressImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 0.7 quality
      };
      img.src = dataUrl;
    });
  };

  const processImage = async (dataUrl: string) => {
    setIsScanning(true);
    setError(null);
    
    try {
      const compressed = await compressImage(dataUrl);
      const analysis = await analyzeFood(compressed);
      setResult(analysis);
      updateAchievement('a9', 1, 'add');
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Não foi possível analisar a imagem. Tente novamente ou use uma foto menor.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      processImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'unrecommended': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 size={16} />;
      case 'moderate': return <AlertTriangle size={16} />;
      case 'unrecommended': return <XCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-bg-light text-slate-900 overflow-y-auto"
    >
      {/* Header */}
      <header translate="no" className="px-6 py-8 flex flex-col gap-1 bg-bg-light">
        <button onClick={onClose} className="w-10 h-10 -ml-2 rounded-xl glass flex items-center justify-center text-primary-green active:scale-95 transition-transform mb-2">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">ANALISAR REFEIÇÃO</h2>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">PRECISÃO NUTRICIONAL</p>
      </header>

      <div className="px-6 pb-12 flex-1 flex flex-col items-center max-w-md mx-auto w-full">
        {isCameraActive && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col">
            <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
              <button onClick={stopCamera} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <X size={24} />
              </button>
            </header>
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="flex-1 object-cover"
            />
            
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center z-10">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-white active:scale-90 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full mb-6 p-6 glass border-red-500/20 rounded-[2.5rem] flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/20">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900 uppercase italic">ACESSO NECESSÁRIO</p>
              <p className="text-xs font-medium text-slate-400 leading-relaxed px-4">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-[10px] font-black uppercase tracking-widest text-red-500 glass px-6 py-3 rounded-full active:scale-95 transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {!image ? (
          <div className="w-full glass rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-8 border-primary-green/5">
            {/* Camera Icon Circle */}
            <div className="w-24 h-24 bg-primary-green rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary-green/20">
              <Camera size={40} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900 italic uppercase">FOTO DO PRATO</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium uppercase tracking-tighter">
                A IA vai identificar os alimentos e dar uma análise completa
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-4 bg-primary-green text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-green/20 active:scale-95 transition-all italic"
              >
                <Upload size={18} />
                Galeria
              </button>
              <button 
                onClick={startCamera}
                className="flex items-center justify-center gap-2 py-4 glass text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all italic"
              >
                <Camera size={18} />
                Câmera
              </button>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleCapture} 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="w-full space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <img src={image} alt="Refeição" className="w-full h-full object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <Loader2 size={48} className="animate-spin text-primary-green mb-4" />
                  <p className="font-black text-lg text-primary-green italic uppercase">PROCESSANDO...</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-[0.2em]">Escaneando nutrientes em tempo real</p>
                </div>
              )}
            </div>

            {!isScanning && result && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-12"
              >
                {/* Basic Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 italic uppercase">{result.name}</h3>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic border",
                      result.classification === 'healthy' ? "text-primary-green bg-primary-green/10 border-primary-green/20" : result.classification === 'moderate' ? "text-yellow-600 bg-yellow-50 border-yellow-100" : "text-red-500 bg-red-50 border-red-100"
                    )}>
                      {getStatusIcon(result.classification)}
                      {result.classification === 'healthy' ? 'Saudável' : result.classification === 'moderate' ? 'Moderado' : 'Não Recomendado'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-primary-green italic">{result.calories}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kcal / 100g</span>
                  </div>
                </div>

                {/* Macronutrients */}
                <div className="grid grid-cols-3 gap-3">
                  <MacroCard label="Proteína" value={result.macros.protein} color="emerald" />
                  <MacroCard label="Carbs" value={result.macros.carbs} color="sky" />
                  <MacroCard label="Gordura" value={result.macros.fats} color="orange" />
                </div>

                {/* Recommendation */}
                <div className="glass rounded-[2rem] p-6 space-y-4 border-primary-green/5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                      result.canIEat.answer === 'sim' ? "bg-primary-green text-white shadow-primary-green/20" : "bg-red-500 text-white shadow-red-500/20"
                    )}>
                      <Sparkles size={24} className="font-black" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">PODE COMER?</p>
                      <p className="text-lg font-black text-slate-900 italic tracking-tighter">{result.canIEat.answer.toUpperCase()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {result.canIEat.explanation}
                  </p>
                </div>

                {/* Alternatives */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 italic">ALTERNATIVAS MAIS SAUDÁVEIS</h4>
                  <div className="space-y-2">
                    {result.alternatives.map((alt, i) => (
                      <div key={i} className="glass rounded-2xl p-4 flex items-center justify-between group hover:border-primary-green/30 transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-green/10 flex items-center justify-center text-primary-green">
                            <Apple size={16} />
                          </div>
                          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{alt}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    onClick={() => { setImage(null); setResult(null); }}
                    className="py-5 glass rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 active:scale-95 transition-all italic"
                  >
                    Novo Scan
                  </button>
                  <button 
                    onClick={onClose}
                    className="py-5 bg-primary-green rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-primary-green/20 active:scale-95 transition-all italic"
                  >
                    Salvar Refeição
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MacroCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-50 text-center shadow-xs">
    <span className="block text-sm font-black text-slate-800 mb-1">{value}</span>
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-widest",
      color === 'emerald' ? 'text-emerald-500' : color === 'sky' ? 'text-sky-500' : 'text-orange-500'
    )}>{label}</span>
  </div>
);

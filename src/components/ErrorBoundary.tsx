import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 uppercase italic">Ops! Algo deu errado</h1>
          <p className="text-slate-500 mb-8 max-w-md font-medium">
            Ocorreu um erro inesperado na aplicação. Você pode tentar recarregar a página ou limpar os dados locais.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary-green text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-green/20"
            >
              <RefreshCw size={20} />
              RECARREGAR PÁGINA
            </button>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm"
            >
              LIMPAR DADOS E REINICIAR
            </button>
          </div>
          
          <div className="w-full max-w-lg p-4 bg-slate-100 rounded-xl text-left text-xs font-mono overflow-auto max-h-48 text-red-500 select-all border border-red-100">
            <p className="font-bold mb-1">DETALHES DO ERRO (ENVIE AO SUPORTE):</p>
            <p>{this.state.error?.name}: {this.state.error?.message}</p>
            {this.state.error?.stack && <p className="mt-2 opacity-70">{this.state.error.stack}</p>}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

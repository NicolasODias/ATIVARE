import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Inheriting from React.Component with explicit generic types to ensure setState and props are correctly typed and inherited
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
          <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-red-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Ops! Algo deu errado</h1>
            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
              Detectamos uma falha crítica na renderização. Por segurança, sugerimos reiniciar sua sessão.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={this.handleReset}
                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-all"
              >
                <RefreshCcw className="w-4 h-4" /> Recarregar Sistema
              </button>
              <button 
                // Accessing setState from base class
                onClick={() => this.setState({ hasError: false })}
                className="w-full py-4 bg-slate-100 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
              >
                Tentar Novamente
              </button>
            </div>
            
            {this.state.error && (
              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-mono text-slate-400 break-all text-left uppercase">Erro: {this.state.error.message}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Accessing props from base class
    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  QrCode, 
  Search,
  Loader2,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { Company } from '../types';
import { dataStore } from '../services/dataStore';

interface PublicEvaluationLandingProps {
  initialCode?: string;
  onCompanyValidated: (company: Company) => void;
}

const PublicEvaluationLanding: React.FC<PublicEvaluationLandingProps> = ({ initialCode, onCompanyValidated }) => {
  const [inputCode, setInputCode] = useState(initialCode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(!initialCode);

  const validateCode = (code: string) => {
    setLoading(true);
    setError('');
    
    // Simulação de delay para efeito de "buscando estabelecimento"
    setTimeout(() => {
      const company = dataStore.getCompanyByTrackingCode(code.toUpperCase());
      if (company) {
        onCompanyValidated(company);
      } else {
        setError('Código público inválido ou estabelecimento indisponível.');
        setLoading(false);
      }
    }, 1200);
  };

  useEffect(() => {
    if (initialCode) {
      validateCode(initialCode);
    }
  }, [initialCode]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-inter selection:bg-primary/10">
      {/* Background Decorativo - Tech Premium */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Header/Logo Ativare */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">A</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Ativare <span className="text-primary font-light">Experience</span></span>
          </div>
        </div>

        {/* Hero Section Persuasiva */}
        <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-accent" /> Avaliação Oficial
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Avalie sua experiência em <span className="text-primary underline decoration-accent/30">menos de 1 minuto.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Seu feedback é o motor que melhora nosso atendimento, gastronomia e ambiente. Participe e ajude-nos a evoluir.
          </p>
        </div>

        {/* Card Principal de Ação */}
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,71,167,0.15)] border border-slate-100 p-8 md:p-12 mb-16 relative overflow-hidden group">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
               <div className="relative">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary/40" />
                  </div>
               </div>
               <p className="text-sm font-black uppercase text-primary tracking-widest animate-pulse">Localizando estabelecimento...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {showInput ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-800">Identifique o Local</h3>
                    <p className="text-slate-400 text-sm font-medium">Insira o código de 6 dígitos presente no seu recibo ou mesa.</p>
                  </div>

                  <div className="max-w-xs mx-auto space-y-4">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="Ex: AB1234"
                      className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-primary text-center text-3xl font-black tracking-[0.3em] text-primary transition-all placeholder:text-slate-200"
                    />
                    {error && <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 py-2 rounded-xl">{error}</p>}
                    
                    <button 
                      onClick={() => validateCode(inputCode)}
                      disabled={inputCode.length < 4}
                      className="w-full py-5 bg-primary text-white font-black rounded-[2rem] shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 uppercase tracking-widest text-xs"
                    >
                      Começar Avaliação <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Código Detectado!</h3>
                    <p className="text-slate-500 font-medium italic">"Estamos preparando sua experiência de avaliação..."</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decoração interna do card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>

        {/* Benefícios e Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><Clock className="w-6 h-6" /></div>
              <h4 className="text-lg font-black">Rápido</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Desenvolvido para ser respondido em segundos, sem burocracia.</p>
           </div>
           <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm"><Heart className="w-6 h-6" /></div>
              <h4 className="text-lg font-black">Evolutivo</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Sua nota vai direto para os gestores, ajudando a melhorar o serviço.</p>
           </div>
           <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><ShieldCheck className="w-6 h-6" /></div>
              <h4 className="text-lg font-black">Seguro</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Dados protegidos e tratados exclusivamente para melhoria da experiência.</p>
           </div>
        </div>

        {/* Como Funciona Section */}
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-black uppercase tracking-widest text-white/50 mb-2">Como Funciona</h3>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                 <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/20">1</div>
                    <h5 className="font-bold text-sm uppercase tracking-wider">Informe o Código</h5>
                    <p className="text-xs text-white/40 font-medium">Use o código da sua mesa ou o link do QR Code.</p>
                 </div>
                 <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/20">2</div>
                    <h5 className="font-bold text-sm uppercase tracking-wider">Responda</h5>
                    <p className="text-xs text-white/40 font-medium">Avalie os pilares principais da sua visita hoje.</p>
                 </div>
                 <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/20 text-accent">3</div>
                    <h5 className="font-bold text-sm uppercase tracking-wider">Envie e Pronto!</h5>
                    <p className="text-xs text-white/40 font-medium">Sua contribuição já está ajudando o local.</p>
                 </div>

                 {/* Linha conectora desktop */}
                 <div className="hidden md:block absolute top-7 left-24 right-24 h-px border-t border-dashed border-white/20 z-0"></div>
              </div>
           </div>
           
           {/* Efeito Tech */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        </div>

        {/* Rodapé Simples */}
        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Portal de Avaliação Certificado
           </div>
           <div>
              Ativare Experience • 2024
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEvaluationLanding;

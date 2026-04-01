import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  BarChart3, 
  BrainCircuit, 
  Globe, 
  ClipboardList, 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare,
  Users,
  Award,
  Star,
  TrendingUp,
  Settings2,
  QrCode,
  Send,
  Loader2,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Lock,
  ArrowLeft,
  Scale,
  ShieldAlert,
  Play,
  Heart,
  Gift,
  Smartphone,
  ChevronDown,
  Plus,
  Minus,
  Sparkles,
  PieChart,
  Trophy,
  Activity,
  History,
  Navigation,
  Store,
  Check,
  Smile,
  Frown,
  Instagram
} from 'lucide-react';
import { dataStore } from '../services/dataStore';

type LandingView = 'HOME' | 'SOLUCOES' | 'FUNCIONALIDADES' | 'TERMOS' | 'PRIVACIDADE';

interface LandingPageProps {
  onNavigate: (view: 'LOGIN') => void;
}

// --- COMPONENTES AUXILIARES DE DESIGN (FORA DO COMPONENTE PRINCIPAL PARA ESTABILIDADE) ---

// Fix: Made children optional to avoid inference issues in some TS environments where strings are passed between tags
const SectionBadge = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${className}`}>
    <Sparkles className="w-3 h-3 text-accent" /> {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay = "0" }: any) => (
  <div className={`bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom delay-${delay}`}>
    <div className="w-14 h-14 bg-slate-50 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
  </div>
);

// Auxiliar para CTAs intermediários (Seguindo regras de não alterar layout e manter estilo)
const IntermediaryCTA = ({ onClick, label, microcopy }: { onClick: () => void, label: string, microcopy: string }) => (
  <div className="flex flex-col items-center gap-4 py-12 animate-in fade-in duration-700">
    <button 
      onClick={onClick}
      className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
    >
      {label} <ArrowRight className="w-4 h-4" />
    </button>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{microcopy}</p>
  </div>
);

// --- COMPONENTE DO FORMULÁRIO (ESTÁVEL) ---
const DemoForm = ({ 
  submitted, 
  loading, 
  formData, 
  setFormData, 
  onSubmit 
}: { 
  submitted: boolean, 
  loading: boolean, 
  formData: any, 
  setFormData: any, 
  onSubmit: (e: React.FormEvent) => void 
}) => {
  if (submitted) {
    return (
      <div className="py-16 text-center space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-500/10">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Recebemos seu contato!</h3>
        <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto">Um de nossos consultores estratégicos ligará para você em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Seu Nome</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} type="text" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="Nome completo" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="exemplo@empresa.com" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp de Contato</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="(00) 00000-0000" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Cargo</label>
          <select required value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm appearance-none">
            <option value="">Selecionar...</option>
            <option value="Dono">Dono / CEO</option>
            <option value="Gerente">Gerente</option>
            <option value="Marketing">Marketing / CX</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da Empresa</label>
        <div className="relative">
          <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input required value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} type="text" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="Nome do seu negócio" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50 uppercase tracking-[0.2em] text-xs">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Solicitar Demonstração Gratuita</>}
      </button>
    </form>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState<LandingView>('HOME');
  const [submittedDemo, setSubmittedDemo] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '', email: '', phone: '', jobTitle: '', companyName: '', companyPhone: '', city: '', employees: '1-10'
  });
  const [activeRemarketingTab, setActiveRemarketingTab] = useState<'ANIVERSARIO' | 'PROMOTOR' | 'DETRATOR'>('ANIVERSARIO');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDemo(true);
    setTimeout(() => {
      dataStore.addLead({ ...leadForm, source: 'landing_new' });
      setLoadingDemo(false);
      setSubmittedDemo(true);
    }, 1500);
  };

  const handleSupportClick = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      setIsRedirecting(false);
      window.open('https://wa.me/5535992360284?text=Ol%C3%A1%21%20Preciso%20de%20suporte%20no%20Ativare%20Experience', '_blank');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-inter text-slate-900 overflow-x-hidden">
      {/* Redirection Notification */}
      {isRedirecting && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">Redirecionando para um especialista...</span>
        </div>
      )}

      {/* Navbar Minimalista */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('HOME')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">A</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Ativare <span className="text-primary font-light">Experience</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-black uppercase tracking-widest text-slate-400">
            <button onClick={() => setCurrentView('HOME')} className={`hover:text-primary transition-colors ${currentView === 'HOME' ? 'text-primary' : ''}`}>Home</button>
            <button onClick={() => setCurrentView('SOLUCOES')} className={`hover:text-primary transition-colors ${currentView === 'SOLUCOES' ? 'text-primary' : ''}`}>Soluções</button>
            <button onClick={() => setCurrentView('FUNCIONALIDADES')} className={`hover:text-primary transition-colors ${currentView === 'FUNCIONALIDADES' ? 'text-primary' : ''}`}>Funcionalidades</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('LOGIN')}
              className="px-8 py-3 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest"
            >
              Acessar Painel
            </button>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      {currentView === 'HOME' && (
        <>
          <section className="pt-32 lg:pt-48 pb-24 px-6 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
              <div className="flex-1 space-y-10 text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
                <SectionBadge>Inteligência em Experiência do Cliente</SectionBadge>
                <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 leading-[1] tracking-tight">
                  Não é só medir. <br/>É <span className="text-primary italic">lucrar mais</span> com quem já te conhece.
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                  Agências trazem clientes. A Ativare faz eles voltarem. Transforme feedbacks em histórico de vendas e remarketing automático sem custos de mídia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={scrollToForm} className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    Transformar meu negócio <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentView('SOLUCOES')} className="px-10 py-5 bg-slate-50 text-slate-400 font-black rounded-2xl border border-slate-100 hover:bg-white hover:text-primary transition-all uppercase tracking-widest text-xs">
                    Conhecer Soluções
                  </button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-8 pt-8">
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-black text-slate-900">40%+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aumento em Retenção</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  {/* KPI SUBSTITUÍDO CONFORME SOLICITAÇÃO */}
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-black text-slate-900">12+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Segmentos Atendidos</p>
                    <p className="text-[9px] font-medium text-slate-400 leading-tight">(restaurantes, cafés, eventos…)</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
                 <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-[0_50px_100px_-20px_rgba(0,71,167,0.15)] border border-slate-100 relative">
                    <DemoForm 
                      submitted={submittedDemo}
                      loading={loadingDemo}
                      formData={leadForm}
                      setFormData={setLeadForm}
                      onSubmit={handleLeadSubmit}
                    />
                 </div>
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[80px] animate-pulse"></div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
              </div>
            </div>
          </section>
          
          {/* Social Proof Bar */}
          <section className="py-12 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale">
              <span className="text-xl font-black tracking-tighter">RESTAURANTE.COM</span>
              <span className="text-xl font-black tracking-tighter">BELLA ITÁLIA</span>
              <span className="text-xl font-black tracking-tighter">VILA GASTRÔ</span>
              <span className="text-xl font-black tracking-tighter">HOSPITAL SAÚDE</span>
              <span className="text-xl font-black tracking-tighter">VAREJO TOTAL</span>
            </div>
          </section>

          <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                <SectionBadge>Agência vs Ativare</SectionBadge>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Trabalhamos em <span className="text-primary italic">conjunto.</span></h2>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">A agência enche a sua casa. A Ativare garante que o cliente saia satisfeito e volte mais vezes.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400"><Navigation className="w-6 h-6" /></div>
                       <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">O Foco da Agência</h4>
                    </div>
                    <ul className="space-y-6">
                       {[
                         'Tráfego Pago (Anúncios)',
                         'Gestão de Redes Sociais',
                         'Produção de Fotos e Vídeos',
                         'Alcance de novos públicos'
                       ].map(i => (
                         <li key={i} className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                            <Minus className="w-4 h-4 text-slate-300" /> {i}
                         </li>
                       ))}
                    </ul>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">Traz o cliente pela 1ª vez</p>
                 </div>

                 <div className="bg-primary p-12 rounded-[3.5rem] shadow-2xl shadow-primary/30 space-y-8 text-white relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent"><Award className="w-6 h-6" /></div>
                       <h4 className="text-xl font-black uppercase tracking-tighter">O Foco da Ativare</h4>
                    </div>
                    <ul className="space-y-6 relative z-10">
                       {[
                         'Retenção e Fidelização Real',
                         'Melhoria da Qualidade Operacional',
                         'Histórico de contatos para Remarketing',
                         'Recuperação de clientes insatisfeitos'
                       ].map(i => (
                         <li key={i} className="flex items-center gap-3 font-bold text-sm">
                            <Check className="w-4 h-4 text-accent" /> {i}
                         </li>
                       ))}
                    </ul>
                    <p className="text-xs font-black text-white/40 uppercase tracking-widest pt-4 border-t border-white/10 relative z-10">Faz o cliente gastar mais vezes</p>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 blur-3xl"></div>
                 </div>
              </div>
            </div>

            {/* --- CTA ESTRATÉGICO APÓS TRABALHAMOS EM CONJUNTO --- */}
            <IntermediaryCTA 
              onClick={scrollToForm} 
              label="Quero aumentar minha retenção" 
              microcopy="Descubra onde você está perdendo clientes hoje."
            />
          </section>
          
          <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-20">
               <div className="text-center space-y-4">
                  <SectionBadge>Workflow do Lucro</SectionBadge>
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">O ciclo da <span className="text-primary italic">excelência Ativare.</span></h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-6 group">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-primary transition-all duration-500">1</div>
                     <h3 className="text-2xl font-black">Coleta Inteligente</h3>
                     <p className="text-slate-500 font-medium leading-relaxed">O cliente avalia a experiência no QR Code da mesa. Capturamos o sentimento e o contato em 30 segundos.</p>
                  </div>
                  <div className="space-y-6 group">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-primary transition-all duration-500">2</div>
                     <h3 className="text-2xl font-black">Análise Consultiva</h3>
                     <p className="text-slate-500 font-medium leading-relaxed">Nossa IA cruza dados de atendimento, cozinha e ambiente, gerando diagnósticos claros para o gerente.</p>
                  </div>
                  <div className="space-y-6 group">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-primary transition-all duration-500">3</div>
                     <h3 className="text-2xl font-black">Ação Estratégica</h3>
                     <p className="text-slate-500 font-medium leading-relaxed">A Mentoria Guardiã entra em cena para aplicar treinamentos e remarketing, transformando dados em dinheiro no caixa.</p>
                  </div>
               </div>

               {/* --- CTA ESTRATÉGICO APÓS WORKFLOW DO LUCRO --- */}
               <IntermediaryCTA 
                onClick={scrollToForm} 
                label="Ver meu diagnóstico na prática" 
                microcopy="Leva menos de 2 minutos."
               />
            </div>
          </section>

          <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <SectionBadge>Faturamento Sem Mídia</SectionBadge>
                 <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">O maior ativo do seu negócio são seus <span className="text-primary italic">dados.</span></h2>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">
                   Cada avaliação gera um perfil de cliente com nome e WhatsApp. Use nosso sistema para campanhas cirúrgicas e lucrativas.
                 </p>

                 <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    {[
                      { id: 'ANIVERSARIO', label: 'Aniversariantes', icon: Gift },
                      { id: 'PROMOTOR', label: 'Promotores', icon: Smile },
                      { id: 'DETRATOR', label: 'Em Risco', icon: Frown }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveRemarketingTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRemarketingTab === tab.id ? 'bg-white text-primary shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                      </button>
                    ))}
                 </div>

                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-in fade-in duration-500">
                    {activeRemarketingTab === 'ANIVERSARIO' && (
                      <div className="space-y-4">
                        <h4 className="text-xl font-black text-slate-800">Crie o hábito da celebração</h4>
                        <p className="text-slate-500 text-sm font-medium">Filtre automaticamente quem faz aniversário na semana e envie um cupom exclusivo via WhatsApp. Ticket médio garantido.</p>
                      </div>
                    )}
                    {activeRemarketingTab === 'PROMOTOR' && (
                      <div className="space-y-4">
                        <h4 className="text-xl font-black text-slate-800">Incentive o Boca a Boca</h4>
                        <p className="text-slate-500 text-sm font-medium">Convide seus clientes nota 10 para avaliarem no Google Meu Negócio ou indicarem amigos em troca de benefícios.</p>
                      </div>
                    )}
                    {activeRemarketingTab === 'DETRATOR' && (
                      <div className="space-y-4">
                        <h4 className="text-xl font-black text-slate-800">Recupere o faturamento perdido</h4>
                        <p className="text-slate-500 text-sm font-medium">O sistema te avisa em tempo real quando alguém sai insatisfeito. Peça desculpas e traga-o de volta antes que ele vá para a concorrência.</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="relative group">
                 <div className="bg-slate-50 rounded-[3.5rem] p-12 border border-slate-100 shadow-inner transform group-hover:rotate-1 transition-transform duration-700">
                    <div className="space-y-6">
                       {[
                         { name: 'Ricardo S.', type: 'Aniversariante', val: 'Mensagem enviada' },
                         { name: 'Ana Clara', type: 'Promotora', val: 'Avaliou no Google' },
                         { name: 'Marcos V.', type: 'Recuperado', val: 'Voltou à loja' }
                       ].map((item, i) => (
                         <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">{item.name.charAt(0)}</div>
                               <div>
                                  <p className="text-sm font-black text-slate-800">{item.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
                               </div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase">{item.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="absolute -top-6 -right-6 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/40 animate-bounce">
                    <TrendingUp className="w-6 h-6" />
                 </div>
              </div>
            </div>
          </section>

          <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center relative z-10">
                <div className="flex-1 space-y-10">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em]">
                     <ShieldCheck className="w-3 h-3" /> Mentoria Premium Guardiã
                   </div>
                   <h2 className="text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                     Não te damos apenas o martelo, <span className="text-accent underline decoration-white/20">construímos junto com você.</span>
                   </h2>
                   <p className="text-xl text-white/50 font-medium leading-relaxed">
                     Software sem estratégia é apenas custo. Nossos especialistas "Guardiões" acompanham seus dados e treinam sua equipe para gerar lucro real.
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-xl font-black text-accent flex items-center gap-2"><CheckCircle2 className="w-6 h-6" /> Treinamentos</h4>
                         <p className="text-sm text-white/40 font-medium">Abordagem em mesa, como pedir avaliações de forma elegante e estratégias de pós-venda.</p>
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-xl font-black text-accent flex items-center gap-2"><CheckCircle2 className="w-6 h-6" /> Gestão de Gargalos</h4>
                         <p className="text-sm text-white/40 font-medium">Identificamos o que está fazendo você perder dinheiro: demora na cozinha, limpeza ou atendimento.</p>
                      </div>
                   </div>
                   <button onClick={scrollToForm} className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs">
                      Contratar Consultoria Guardiã
                   </button>
                </div>

                <div className="flex-1 relative">
                   <div className="bg-white/5 rounded-[3.5rem] p-12 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                      <div className="relative z-10 space-y-8">
                         <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/40">
                            <Trophy className="w-8 h-8 text-white" />
                         </div>
                         <h3 className="text-2xl font-black">Acompanhamento Semanal</h3>
                         <div className="space-y-4">
                            {[
                              'Análise de Score Benchmarking',
                              'Métricas internas de performance',
                              'Feedback direto com gerentes',
                              'Planos de ação estruturados'
                            ].map(i => (
                              <div key={i} className="flex items-center gap-3 text-white/70 font-bold text-sm">
                                 <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> {i}
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mb-32"></div>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none grayscale invert">
                <Globe className="w-full h-full scale-150" />
             </div>

             {/* --- CTA ESTRATÉGICO APÓS MENTORIA GUARDIÃ --- */}
             <div className="relative z-10 pt-16">
               <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                <button 
                  onClick={scrollToForm}
                  className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  Quero crescer com acompanhamento estratégico <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Transforme feedback em crescimento previsível.</p>
              </div>
             </div>
          </section>

          <section className="py-32 px-6 bg-slate-50">
             <div className="max-w-4xl mx-auto space-y-20">
                <div className="text-center space-y-4">
                   <SectionBadge>Dúvidas Frequentes</SectionBadge>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">Esclareça suas <span className="text-primary italic">objeções.</span></h2>
                </div>

                <div className="space-y-4">
                   {[
                     { q: "A Ativare substitui minha agência de marketing?", a: "Não, nós complementamos. Sua agência traz o fluxo inicial de clientes, e nós garantimos que esse fluxo se transforme em faturamento recorrente através da satisfação e remarketing." },
                     { q: "Meus clientes realmente vão avaliar?", a: "Sim. Com nossa metodologia e materiais de mesa, a taxa de adesão é 6x maior que o Google convencional, pois é rápido e acontece no calor da experiência." },
                     { q: "Consigo monitorar múltiplas unidades?", a: "Com certeza. O Ativare foi desenhado para redes e franquias, permitindo que o dono tenha uma visão macro e compare o desempenho entre lojas (Benchmarking interno)." },
                     { q: "Como os dados de contato me ajudam?", a: "Diferente de avaliações anônimas, nós capturamos o WhatsApp. Isso permite que você faça campanhas de aniversariantes e promoções diretas sem gastar com anúncios." },
                     { q: "O sistema é difícil de usar?", a: "Zero dificuldade. O painel é intuitivo e focado em ações. Além disso, no plano com Mentoria Guardiã, nós fazemos a análise pesada para você." },
                     { q: "Qual o custo de implementação?", a: "Nós temos uma taxa de setup única para configuração e treinamento, e uma mensalidade baseada no seu volume. O retorno sobre o investimento (ROI) costuma vir no primeiro mês." }
                   ].map((item, i) => (
                     <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <button 
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                        >
                           <span className="font-black text-slate-800 text-base">{item.q}</span>
                           {openFaq === i ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-slate-300" />}
                        </button>
                        {openFaq === i && (
                          <div className="px-8 pb-6 text-slate-500 font-medium text-sm leading-relaxed animate-in slide-in-from-top duration-300">
                            {item.a}
                          </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Final CTA with integrated form */}
          <section ref={formRef} className="py-32 px-6 bg-white scroll-mt-20">
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-8">
                   <SectionBadge>Comece Hoje</SectionBadge>
                   <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">Dê o próximo passo para o <span className="text-primary italic">próximo nível.</span></h2>
                   <p className="text-xl text-slate-500 font-medium">Preencha os dados e receba uma consultoria gratuita com diagnóstico do seu cenário atual.</p>
                   <div className="space-y-6 pt-10 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center"><CheckCircle2 className="w-8 h-8" /></div>
                         <p className="text-lg font-black text-slate-700 uppercase tracking-tight">Sem fidelidade obrigatória</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center"><CheckCircle2 className="w-8 h-8" /></div>
                         <p className="text-lg font-black text-slate-700 uppercase tracking-tight">Suporte 24/7 incluso</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[3.5rem] p-10 lg:p-16 shadow-[0_50px_100px_-20px_rgba(0,71,167,0.15)] border border-slate-100 relative">
                   <DemoForm 
                    submitted={submittedDemo}
                    loading={loadingDemo}
                    formData={leadForm}
                    setFormData={setLeadForm}
                    onSubmit={handleLeadSubmit}
                   />
                </div>
             </div>
          </section>
        </>
      )}

      {currentView === 'SOLUCOES' && (
        <div className="pt-40 pb-32 animate-in fade-in duration-700">
           <div className="max-w-7xl mx-auto px-6 space-y-24">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                 <SectionBadge>Segmentos Atendidos</SectionBadge>
                 <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight">Soluções para quem <span className="text-primary">atende pessoas.</span></h1>
                 <p className="text-xl text-slate-500 font-medium">Cada setor tem sua particularidade. O Ativare se adapta à jornada do seu cliente.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <FeatureCard icon={Store} title="Gastronomia" desc="Tempo de espera, temperatura do prato e cortesia. Essencial para restaurantes, bares e cafés." />
                 <FeatureCard icon={Smartphone} title="E-commerce" desc="Experiência de unboxing, agilidade na entrega e suporte pós-venda digital." />
                 <FeatureCard icon={ShieldCheck} title="Saúde & Bem-Estar" desc="Acolhimento, clareza nas informações e estrutura. Ideal para clínicas e hospitais." />
                 <FeatureCard icon={Briefcase} title="Varejo" desc="Atendimento de consultores, variedade e ambiente de loja física." />
                 <FeatureCard icon={Award} title="Educação" desc="Qualidade do ensino, suporte ao aluno e infraestrutura acadêmica." />
                 <FeatureCard icon={Zap} title="Serviços" desc="Prazos, resolução de problemas e transparência na entrega de resultados." />
              </div>

              <div className="bg-primary rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
                 <h3 className="text-3xl font-black mb-8 relative z-10">Seu setor não está listado?</h3>
                 <p className="text-white/60 font-medium mb-10 max-w-xl mx-auto relative z-10">Criamos fluxos customizados para qualquer negócio que preze pela excelência no atendimento.</p>
                 <button onClick={scrollToForm} className="px-10 py-5 bg-white text-primary font-black rounded-2xl relative z-10 uppercase text-xs tracking-widest hover:scale-105 transition-all">Falar com Consultor</button>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              </div>
           </div>
        </div>
      )}

      {currentView === 'FUNCIONALIDADES' && (
        <div className="pt-40 pb-32 animate-in fade-in duration-700">
           <div className="max-w-7xl mx-auto px-6 space-y-24">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                 <SectionBadge>Poder Tecnológico</SectionBadge>
                 <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight">Funcionalidades de <span className="text-primary italic">ponta.</span></h1>
                 <p className="text-xl text-slate-500 font-medium">Tudo o que você precisa para uma gestão de 360 graus da reputação da sua marca.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-12 bg-slate-900 rounded-[3rem] text-white space-y-6 border border-white/5 shadow-2xl">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center"><BrainCircuit className="w-8 h-8" /></div>
                    <h3 className="text-3xl font-black">Inteligência Artificial Ativare</h3>
                    <p className="text-white/50 leading-relaxed font-medium">Nossa IA proprietária analisa milhares de feedbacks simultaneamente, identificando padrões invisíveis ao olho humano e sugerindo planos de ação imediatos.</p>
                 </div>
                 <div className="p-12 bg-slate-50 rounded-[3rem] space-y-6 border border-slate-100">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white"><Globe className="w-8 h-8" /></div>
                    <h3 className="text-3xl font-black text-slate-900">Benchmarking Global</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">Descubra sua posição real no mercado. Compare seu NPS com a média nacional, regional e do seu nicho de forma anônima e segura.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { icon: QrCode, title: 'QR Code Dinâmico', desc: 'Gere códigos únicos por mesa ou setor para rastrear exatamente onde ocorrem as falhas.' },
                   { icon: MessageSquare, title: 'Alertas de Crise', desc: 'Receba avisos instantâneos no seu WhatsApp quando um cliente deixar uma nota baixa.' },
                   { icon: History, title: 'CRM de Experiência', desc: 'Histórico completo de cada cliente, permitindo um atendimento ultra-personalizado.' },
                   { icon: PieChart, title: 'Dashboards BI', desc: 'Relatórios visuais prontos para exportação e reuniões de diretoria.' },
                   { icon: Users, title: 'Métricas de Equipe', desc: 'Saiba quais colaboradores geram mais promotores para sua marca.' },
                   { icon: Settings2, title: 'Form Builder', desc: 'Crie formulários inteligentes sem precisar de programação.' }
                 ].map((feat, i) => (
                   <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                      <feat.icon className="w-8 h-8 text-primary mb-6" />
                      <h4 className="text-xl font-black mb-3">{feat.title}</h4>
                      <p className="text-slate-400 text-sm font-medium">{feat.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {currentView === 'TERMOS' && (
        <div className="pt-40 pb-32 px-6">
           <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-10 animate-in fade-in duration-700">
              <div className="flex items-center gap-4">
                 <Scale className="w-8 h-8 text-primary" />
                 <h1 className="text-3xl font-black">Termos de Uso</h1>
              </div>
              <div className="prose prose-slate max-w-none text-slate-500 font-medium space-y-6">
                 <p>Ao utilizar o Ativare Experience, você concorda com as diretrizes de ética e transparência na coleta de dados. Nossa plataforma é uma ferramenta de apoio e não garante resultados financeiros sem a correta execução estratégica.</p>
                 <h3 className="text-xl font-black text-slate-900 pt-4">Uso do Software</h3>
                 <p>O acesso é individual e intransferível. Qualquer tentativa de engenharia reversa ou uso indevido dos dados de benchmarking resultará em cancelamento imediato sem reembolso.</p>
              </div>
              <button onClick={() => setCurrentView('HOME')} className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:underline"><ArrowLeft className="w-4 h-4" /> Voltar</button>
           </div>
        </div>
      )}

      {currentView === 'PRIVACIDADE' && (
        <div className="pt-40 pb-32 px-6">
           <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-10 animate-in fade-in duration-700">
              <div className="flex items-center gap-4">
                 <ShieldAlert className="w-8 h-8 text-emerald-500" />
                 <h1 className="text-3xl font-black">Privacidade & LGPD</h1>
              </div>
              <div className="prose prose-slate max-w-none text-slate-500 font-medium space-y-6">
                 <p>Sua segurança é nossa prioridade. Todos os dados coletados são criptografados e o tratamento de dados de terceiros segue rigorosamente a Lei Geral de Proteção de Dados (LGPD).</p>
                 <h3 className="text-xl font-black text-slate-900 pt-4">Coleta de WhatsApp</h3>
                 <p>A captura do contato do cliente para remarketing deve ser acompanhada de consentimento explícito no formulário de avaliação, configurado pelo estabelecimento.</p>
              </div>
              <button onClick={() => setCurrentView('HOME')} className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:underline"><ArrowLeft className="w-4 h-4" /> Voltar</button>
           </div>
        </div>
      )}

      {/* Footer SaaS Premium */}
      <footer className="bg-slate-50 pt-24 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black italic">A</div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Ativare</span>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Líder em gestão de reputação e experiência para o setor presencial e digital. Transformando opiniões em lucros.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
               <a href="https://www.instagram.com/ativareexp/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                 <Instagram className="w-5 h-5" />
               </a>
               <a href="mailto:suporte@ativareexp.com" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
                 <Mail className="w-5 h-5" />
               </a>
               <button 
                 onClick={handleSupportClick}
                 className="px-6 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-primary transition-all shadow-sm text-[10px] font-black uppercase tracking-widest"
               >
                 <MessageSquare className="w-4 h-4" /> Suporte
               </button>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Navegação</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><button onClick={() => setCurrentView('HOME')} className="hover:text-primary transition-all">Página Inicial</button></li>
              <li><button onClick={() => setCurrentView('SOLUCOES')} className="hover:text-primary transition-all">Nossas Soluções</button></li>
              <li><button onClick={() => setCurrentView('FUNCIONALIDADES')} className="hover:text-primary transition-all">Funcionalidades</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Legal & Suporte</h5>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><button onClick={() => setCurrentView('TERMOS')} className="hover:text-primary transition-all">Termos de Uso</button></li>
              <li><button onClick={() => setCurrentView('PRIVACIDADE')} className="hover:text-primary transition-all">Privacidade (LGPD)</button></li>
              <li><button className="hover:text-primary transition-all">Central de Ajuda</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Assine a News</h5>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Dicas de gestão de CX e estratégias de lucro toda semana.</p>
            <div className="flex gap-2">
               <input placeholder="Seu e-mail" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary shadow-sm" />
               <button className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © 2024 Ativare Experience. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SSL 256-bit Secure</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Navigation className="w-4 h-4 text-primary" />
                <span>Brasil / Global</span>
             </div>
        </div>
      </div>
      </footer>
    </div>
  );
};

export default LandingPage;

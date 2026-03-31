
import React, { useState, useEffect } from 'react';
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
  PlayCircle,
  PieChart,
  Instagram,
  Store,
  Stethoscope,
  Hotel,
  ShoppingBag,
  FileText,
  UserPlus,
  LayoutDashboard,
  Check,
  Minus,
  Sparkles,
  TrendingUp,
  Settings2,
  QrCode,
  Send,
  Loader2,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';
import { dataStore } from '../services/dataStore';

type LandingView = 'HOME' | 'SOLUCOES' | 'FUNCIONALIDADES' | 'PLANOS';

interface LandingPageProps {
  onNavigate: (view: 'LOGIN') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState<LandingView>('HOME');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [submittedDemo, setSubmittedDemo] = useState(false);
  
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyName: '',
    companyPhone: '',
    city: '',
    employees: '1-10'
  });

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDemo(true);
    
    // Persistência real no DataStore compartilhado
    setTimeout(() => {
      dataStore.addLead({
        ...leadForm,
        source: 'landing'
      });
      setLoadingDemo(false);
      setSubmittedDemo(true);
      setLeadForm({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        companyName: '',
        companyPhone: '',
        city: '',
        employees: '1-10'
      });
    }, 1500);
  };

  const Header = () => (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button 
          onClick={() => setCurrentView('HOME')}
          className="flex items-center gap-2 hover:opacity-80 transition-all"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">A</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Ativare <span className="text-primary font-light">Experience</span></span>
        </button>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <button 
            onClick={() => setCurrentView('HOME')} 
            className={`hover:text-primary transition-colors ${currentView === 'HOME' ? 'text-primary' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView('SOLUCOES')} 
            className={`hover:text-primary transition-colors ${currentView === 'SOLUCOES' ? 'text-primary' : ''}`}
          >
            Soluções
          </button>
          <button 
            onClick={() => setCurrentView('FUNCIONALIDADES')} 
            className={`hover:text-primary transition-colors ${currentView === 'FUNCIONALIDADES' ? 'text-primary' : ''}`}
          >
            Funcionalidades
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('LOGIN')}
            className="px-8 py-3 bg-primary text-white text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest"
          >
            Acessar conta
          </button>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-slate-50 pt-24 pb-12 px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black italic">A</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Ativare</span>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Líder em gestão de reputação e experiência para o setor de alimentação, saúde e varejo.
          </p>
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><Instagram className="w-5 h-5" /></div>
             <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><Users className="w-5 h-5" /></div>
          </div>
        </div>

        <div>
          <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-8">Navegação</h5>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><button onClick={() => setCurrentView('HOME')} className="hover:text-primary transition-colors">Home</button></li>
            <li><button onClick={() => setCurrentView('SOLUCOES')} className="hover:text-primary transition-colors">Soluções</button></li>
            <li><button onClick={() => setCurrentView('FUNCIONALIDADES')} className="hover:text-primary transition-colors">Funcionalidades</button></li>
          </ul>
        </div>

        <div>
          <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-8">Empresa</h5>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><a href="#" className="hover:text-primary transition-colors">Sobre nós</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-8">Legal</h5>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          © 2024 Ativare Experience. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
           <ShieldCheck className="w-4 h-4 text-emerald-500" />
           <span>Ambiente Seguro 256-bit SSL</span>
        </div>
      </div>
    </footer>
  );

  const CTASection = () => (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
         <div className="relative z-10 space-y-8">
            <h3 className="text-4xl lg:text-5xl font-black leading-tight">Pronto para transformar sua <br/>gestão de experiência?</h3>
            <p className="text-xl text-white/70 font-medium max-w-xl mx-auto">
              Nossos consultores estão prontos para desenhar a estratégia perfeita para o seu estabelecimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                onClick={() => { setCurrentView('HOME'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-12 py-5 bg-white text-primary font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-xs"
               >
                 Solicitar Demonstração Grátis
               </button>
               <button 
                onClick={() => onNavigate('LOGIN')}
                className="px-12 py-5 bg-primary border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
               >
                 Acessar Minha Conta
               </button>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>
    </section>
  );

  // --- SUB-VIEWS ---

  const HomeView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section with Lead Form */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 relative z-10 lg:pt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Gestão de Reputação Consultiva
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Transforme a opinião do cliente em <span className="text-primary italic">lucro real.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
              A plataforma definitiva para ouvir, analisar e agir. Descubra como grandes redes estão usando o Ativare para escalar sua qualidade.
            </p>
            
            <div className="space-y-6 pt-6 border-t border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">Implementação assistida por especialistas</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">Integração personalizada com seu PDV</p>
               </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 relative z-20">
               {submittedDemo ? (
                 <div className="py-20 text-center space-y-6 animate-in zoom-in">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                       <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Solicitação Enviada!</h3>
                    <p className="text-slate-400 font-medium">Nossa equipe entrará em contato com você em até 24 horas úteis para agendar sua demonstração.</p>
                    <button 
                      onClick={() => setSubmittedDemo(false)}
                      className="text-xs font-black text-primary uppercase tracking-widest underline"
                    >
                      Fazer outra solicitação
                    </button>
                 </div>
               ) : (
                 <form onSubmit={handleLeadSubmit} className="space-y-6">
                    <div className="space-y-4 mb-6">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">Solicite uma demonstração</h3>
                       <p className="text-sm text-slate-400 font-medium">Preencha os dados abaixo e entraremos em contato.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome do Responsável</label>
                          <div className="relative">
                             <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="Seu nome" />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Corporativo</label>
                          <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="exemplo@empresa.com" />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefone / WhatsApp</label>
                          <div className="relative">
                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} type="tel" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="(00) 00000-0000" />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Cargo</label>
                          <div className="relative">
                             <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <select required value={leadForm.jobTitle} onChange={e => setLeadForm({...leadForm, jobTitle: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all appearance-none">
                                <option value="">Selecionar...</option>
                                <option value="Dono">Dono / CEO</option>
                                <option value="Gerente">Gerente</option>
                                <option value="Marketing">Marketing / CX</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da Empresa</label>
                             <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input required value={leadForm.companyName} onChange={e => setLeadForm({...leadForm, companyName: e.target.value})} type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="Nome do seu negócio" />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Cidade</label>
                             <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input required value={leadForm.city} onChange={e => setLeadForm({...leadForm, city: e.target.value})} type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="Ex: São Paulo" />
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefone Empresa</label>
                             <input required value={leadForm.companyPhone} onChange={e => setLeadForm({...leadForm, companyPhone: e.target.value})} type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all" placeholder="(00) 0000-0000" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nº Funcionários</label>
                             <select required value={leadForm.employees} onChange={e => setLeadForm({...leadForm, employees: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-slate-900 text-sm transition-all appearance-none">
                                <option value="1-10">1 a 10</option>
                                <option value="11-50">11 a 50</option>
                                <option value="51-200">51 a 200</option>
                                <option value="200+">Mais de 200</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loadingDemo}
                      className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50 uppercase tracking-widest text-xs"
                    >
                       {loadingDemo ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Solicitar Demonstração</>}
                    </button>
                    <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">Garantimos a privacidade dos seus dados.</p>
                 </form>
               )}
            </div>
            
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Benefícios Exclusivos</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Por que gerir sua experiência com o Ativare?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
               <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-8 h-8" />
               </div>
               <h4 className="text-2xl font-black mb-4">Inteligência de Mercado</h4>
               <p className="text-slate-500 font-medium leading-relaxed">Nossa IA analisa sentimentos em massa, identificando tendências e gargalos operacionais antes que eles se tornem crises.</p>
            </div>
            
            <div className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
               <div className="w-16 h-16 bg-accent/5 text-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8" />
               </div>
               <h4 className="text-2xl font-black mb-4">Aumento de Receita</h4>
               <p className="text-slate-500 font-medium leading-relaxed">Clientes satisfeitos gastam 40% mais. O Ativare ajuda você a fidelizar promotores e recuperar detratores de forma automática.</p>
            </div>

            <div className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
               <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Settings2 className="w-8 h-8" />
               </div>
               <h4 className="text-2xl font-black mb-4">Gestão de Equipe</h4>
               <p className="text-slate-500 font-medium leading-relaxed">Monitore a performance do seu staff através de métricas internas e feedbacks diretos dos clientes por setor ou unidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                  <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Fluxo de Sucesso</h2>
                  <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">O caminho mais curto para a excelência.</h3>
               </div>

               <div className="space-y-10">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-primary/20">1</div>
                     <div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Configure seu QR Code</h4>
                        <p className="text-slate-500 font-medium">Ative sua conta e gere links ou QR Codes personalizados para seu estabelecimento em segundos.</p>
                     </div>
                  </div>

                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-primary/20">2</div>
                     <div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Colete Feedbacks Reais</h4>
                        <p className="text-slate-500 font-medium">O cliente avalia a experiência no momento em que ela acontece, garantindo dados precisos e honestos.</p>
                     </div>
                  </div>

                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-primary/20">3</div>
                     <div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Analise e Evolua</h4>
                        <p className="text-slate-500 font-medium">Receba relatórios automáticos e use nossa IA para entender como melhorar sua nota NPS e seu faturamento.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative">
               <div className="bg-slate-900 rounded-[3rem] p-12 aspect-square flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <QrCode className="w-2/3 h-2/3 text-white opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                     <div className="bg-white p-8 rounded-[2rem] shadow-2xl transform -rotate-6">
                        <QrCode className="w-32 h-32 text-primary" />
                        <p className="text-[10px] font-black uppercase text-center mt-4 text-slate-400">Escaneie para avaliar</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );

  const SolucoesView = () => (
    <div className="animate-in slide-in-from-bottom duration-700">
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6">Soluções para cada <span className="text-primary">pilar do mercado.</span></h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Oferecemos inteligência de dados especializada para diferentes tipos de operação presencial.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <IndustryCard 
            icon={Store} 
            title="Gastronomia & Food Service" 
            desc="Otimize o tempo de espera, qualidade dos pratos e performance da equipe de salão através de NPS instantâneo."
            points={['Redução de desperdício', 'Fidelização de clientes', 'Controle de qualidade por prato']}
           />
           <IndustryCard 
            icon={Stethoscope} 
            title="Saúde & Bem-estar" 
            desc="Entenda a jornada do paciente desde o agendamento até o pós-atendimento. Essencial para clínicas e laboratórios."
            points={['Humanização no atendimento', 'Gestão de reclamações críticas', 'Métricas de recepção']}
           />
           <IndustryCard 
            icon={Hotel} 
            title="Hospitalidade & Eventos" 
            desc="Garanta que cada hóspede ou participante tenha uma experiência memorável. Monitoramento 24h de serviços."
            points={['Feedback em tempo real', 'Gestão de equipe de limpeza', 'Benchmarking do setor']}
           />
           <IndustryCard 
            icon={ShoppingBag} 
            title="Varejo Premium" 
            desc="Mensure a satisfação no PDV e descubra o que impede o fechamento de vendas na sua loja física."
            points={['Aumento de ticket médio', 'Avaliação de consultores', 'Layout e ambiente']}
           />
        </div>
      </section>
      <CTASection />
    </div>
  );

  const FuncionalidadesView = () => (
    <div className="animate-in slide-in-from-bottom duration-700">
      <section className="pt-40 pb-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
           <h1 className="text-5xl lg:text-6xl font-black mb-6">A plataforma mais <br/><span className="text-accent underline">robusta</span> do mercado.</h1>
           <p className="text-xl text-slate-400 max-w-2xl font-medium">Cada módulo foi desenhado para fechar o ciclo entre o feedback e a melhoria operacional.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureItem 
          icon={PieChart} 
          title="Inteligência de Dados (BI)" 
          desc="Dashboards intuitivos que mostram em tempo real a saúde do seu negócio. Filtre por data, canal e categoria."
        />
        <FeatureItem 
          icon={BrainCircuit} 
          title="Insights com IA" 
          desc="Nossa inteligência artificial proprietária analisa milhares de comentários e gera diagnósticos automáticos."
          isNew
        />
        <FeatureItem 
          icon={Globe} 
          title="Benchmarking do Setor" 
          desc="Compare sua performance com a média do seu segmento e região geográfica de forma anônima."
        />
        <FeatureItem 
          icon={Target} 
          title="Métricas Internas" 
          desc="Crie formulários invisíveis ao cliente para sua equipe auditar processos e padrões internos."
        />
        <FeatureItem 
          icon={ClipboardList} 
          title="Gestão de Casos (Tickets)" 
          desc="Fluxo de resolução para feedbacks negativos. Transforme detratores em promotores antes que saiam do local."
        />
        <FeatureItem 
          icon={FileText} 
          title="Relatórios Executivos" 
          desc="Exporte relatórios em PDF prontos para reuniões de diretoria ou treinamentos de equipe."
        />
        <FeatureItem 
          icon={LayoutDashboard} 
          title="Formulários Dinâmicos" 
          desc="Construtor no-code de formulários com lógica condicional e diversos tipos de escala (NPS, 1-5, SIM/NÃO)."
        />
        <FeatureItem 
          icon={UserPlus} 
          title="Gestão de Equipe" 
          desc="Adicione múltiplos usuários com diferentes níveis de acesso (Admin, Agente, Somente Leitura)."
        />
        <FeatureItem 
          icon={Award} 
          title="Programas de Incentivo" 
          desc="Mensure quais funcionários recebem mais elogios e crie programas de premiação baseados em dados reais."
        />
      </section>
      <CTASection />
    </div>
  );

  const PlanosView = () => (
    <div className="animate-in slide-in-from-bottom duration-700">
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6">Investimento com <span className="text-primary italic">retorno garantido.</span></h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Planos flexíveis que acompanham o crescimento da sua rede ou unidade.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <PriceCard 
            title="Degustação" 
            price="0" 
            features={['50 Avaliações / mês', '3 Usuários', 'Gestão de Casos', 'Dashboards Básicos']}
            cta="Falar com Consultor"
            onAction={() => { setCurrentView('HOME'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
          <PriceCard 
            title="Profissional" 
            price="199" 
            featured
            features={['500 Avaliações / mês', '10 Usuários', 'IA de Insights Inclusa', 'Benchmarking do Setor', 'Relatórios em PDF']}
            cta="Falar com Consultor"
            onAction={() => { setCurrentView('HOME'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
          <PriceCard 
            title="Enterprise" 
            price="Consultar" 
            features={['Avaliações Ilimitadas', 'Usuários Ilimitados', 'API & Integrações', 'Suporte Prioritário 24/7', 'Gestor de Contas']}
            cta="Falar com Consultor"
            onAction={() => { setCurrentView('HOME'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </div>

        {/* Tabela Comparativa */}
        <div className="hidden lg:block overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-xl">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-900 text-white">
                    <th className="p-10 text-xl font-black">Funcionalidades</th>
                    <th className="p-10 text-center">Degustação</th>
                    <th className="p-10 text-center">Profissional</th>
                    <th className="p-10 text-center text-accent">Enterprise</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 <ComparisonRow label="Avaliações Mensais" free="50" pro="500" ent="Ilimitadas" />
                 <ComparisonRow label="Gestão de Casos" free pro ent />
                 <ComparisonRow label="Dashboard BI" free="Básico" pro="Completo" ent="Customizado" />
                 <ComparisonRow label="IA de Insights" free={false} pro ent />
                 <ComparisonRow label="Benchmarking" free={false} pro ent />
                 <ComparisonRow label="Relatórios PDF" free={false} pro ent />
                 <ComparisonRow label="Acesso via API" free={false} pro={false} ent />
                 <ComparisonRow label="White-label" free={false} pro={false} ent />
              </tbody>
           </table>
        </div>
      </section>
      <CTASection />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-inter text-slate-900 overflow-x-hidden">
      <Header />

      <main>
        {currentView === 'HOME' && <HomeView />}
        {currentView === 'SOLUCOES' && <SolucoesView />}
        {currentView === 'FUNCIONALIDADES' && <FuncionalidadesView />}
        {currentView === 'PLANOS' && <PlanosView />}
      </main>

      <Footer />
    </div>
  );
};

// --- HELPER COMPONENTS ---

const IndustryCard = ({ icon: Icon, title, desc, points }: any) => (
  <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
     <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8" />
     </div>
     <h3 className="text-2xl font-black mb-4">{title}</h3>
     <p className="text-slate-500 mb-8 font-medium leading-relaxed">{desc}</p>
     <ul className="space-y-4">
        {points.map((p: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {p}
          </li>
        ))}
     </ul>
  </div>
);

const FeatureItem = ({ icon: Icon, title, desc, isNew }: any) => (
  <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-default group">
     <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <Icon className="w-6 h-6" />
        </div>
        {isNew && <span className="px-2 py-1 bg-accent text-white text-[8px] font-black uppercase rounded-lg">Exclusivo IA</span>}
     </div>
     <h4 className="text-xl font-black mb-3">{title}</h4>
     <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

const PriceCard = ({ title, price, features, cta, featured, onAction }: any) => (
  <div className={`p-10 rounded-[3rem] border transition-all flex flex-col justify-between ${featured ? 'bg-white border-4 border-primary shadow-[0_40px_80px_-20px_rgba(0,71,167,0.2)] scale-105 relative z-10' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}>
    <div>
      {featured && <div className="absolute top-0 right-10 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Mais escolhido</div>}
      <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${featured ? 'text-primary' : 'text-slate-400'}`}>{title}</h4>
      <div className="flex items-baseline gap-1 mb-8">
        {price !== 'Consultar' && <span className="text-sm font-bold text-slate-400">R$</span>}
        <span className="text-5xl font-black text-slate-900">{price}</span>
        {price !== 'Consultar' && <span className="text-sm font-bold text-slate-400">/mês</span>}
      </div>
      <ul className="space-y-4 mb-12">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${featured ? 'text-primary' : 'text-slate-300'}`} /> {f}
          </li>
        ))}
      </ul>
    </div>
    <button 
      onClick={onAction}
      className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${featured ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-black' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
    >
      {cta}
    </button>
  </div>
);

const ComparisonRow = ({ label, free, pro, ent }: any) => (
  <tr>
    <td className="p-8 text-sm font-bold text-slate-700">{label}</td>
    <td className="p-8 text-center text-sm font-medium text-slate-500">
      {typeof free === 'boolean' ? (free ? <Check className="mx-auto text-emerald-500" /> : <Minus className="mx-auto text-slate-200" />) : free}
    </td>
    <td className="p-8 text-center text-sm font-bold text-slate-900 bg-slate-50/30">
      {typeof pro === 'boolean' ? (pro ? <Check className="mx-auto text-primary" /> : <Minus className="mx-auto text-slate-200" />) : pro}
    </td>
    <td className="p-8 text-center text-sm font-black text-accent">
      {typeof ent === 'boolean' ? (ent ? <Check className="mx-auto" /> : <Minus className="mx-auto text-slate-200" />) : ent}
    </td>
  </tr>
);

export default LandingPage;

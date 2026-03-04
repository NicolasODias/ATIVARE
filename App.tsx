
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Company, FeedbackChannel } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CaseManagement from './components/CaseManagement';
import FeedbackForm from './components/FeedbackForm';
import Feedbacks from './components/Feedbacks';
import Customers from './components/Customers';
import InternalFormConfig from './components/InternalFormConfig';
import InternalMetrics from './components/InternalMetrics';
import CompanyProfile from './components/CompanyProfile';
import UserProfile from './components/UserProfile';
import UsersTeam from './components/UsersTeam';
import AccountBilling from './components/AccountBilling';
import Benchmarking from './components/Benchmarking';
import BI from './components/BI';
import LandingPage from './components/LandingPage';
import MasterLeads from './components/MasterLeads';
import MasterClients from './components/MasterClients';
import MasterFinance from './components/MasterFinance';
import MasterAdminPanel from './components/MasterAdminPanel';
import PublicEvaluationLanding from './components/PublicEvaluationLanding';
import BusinessSelector from './components/BusinessSelector';
import Growth from './components/Growth'; // Nova Aba
import { 
  Lock,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  X,
  Mail,
  Smartphone,
  Store,
  MapPin,
  ChevronRight,
  Send,
  User as UserIcon,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { dataStore } from './services/dataStore';
import { supabaseClient } from './services/supabaseClient';

const ACTIVE_BUSINESS_KEY = 'ativare_active_business_id';

// ABAS QUE NÃO DEPENDEM DE UMA UNIDADE SELECIONADA
const GLOBAL_TABS = ['master_clients', 'master_leads', 'master_admin_console', 'my_profile'];

// ABAS QUE EXIGEM CONTEXTO DE NEGÓCIO
const UNIT_BASED_TABS = ['cases', 'feedbacks', 'customers', 'internal_metrics', 'company_profile', 'form_config', 'benchmarking', 'bi', 'growth'];

const MandatoryPasswordChange: React.FC<{ user: User, onComplete: (updatedUser: User) => void }> = ({ user, onComplete }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // REQUISITO: Mínimo 8 caracteres
    if (newPass.length < 8) { 
      setError('A senha deve ter no mínimo 8 caracteres por segurança.'); 
      return; 
    }
    
    // REQUISITO: Confirmação igual
    if (newPass !== confirmPass) { 
      setError('As senhas digitadas não coincidem.'); 
      return; 
    }
    
    setLoading(true);
    setTimeout(() => {
      const updated = dataStore.completeMandatoryPasswordChange(user.id, newPass);
      if (updated) {
        onComplete(updated);
      } else { 
        setError('Ocorreu um erro ao atualizar a senha. Tente novamente.'); 
        setLoading(false); 
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 font-inter animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-500">
        <div className="p-12 space-y-8">
           <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">Segurança Obrigatória</h2>
                <p className="text-slate-400 font-medium text-sm mt-2">Olá <span className="text-primary font-bold">{user.name}</span>, detectamos que este é seu primeiro acesso. Por segurança, defina uma senha definitiva agora.</p>
              </div>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nova Senha (Mín. 8 caracteres)</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required 
                      autoFocus
                      type={showPass ? "text" : "password"} 
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" 
                      placeholder="Sua nova senha forte" 
                      value={newPass} 
                      onChange={e => setNewPass(e.target.value)} 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">
                       {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Confirmar Senha</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required 
                      type={showPass ? "text" : "password"} 
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" 
                      placeholder="Repita a nova senha" 
                      value={confirmPass} 
                      onChange={e => setConfirmPass(e.target.value)} 
                    />
                 </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 py-3 rounded-xl border border-red-100 animate-in slide-in-from-top-1">
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Atualizar e Acessar</>}
              </button>
           </form>
        </div>
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">O acesso às ferramentas só será liberado após esta etapa.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => localStorage.getItem(ACTIVE_BUSINESS_KEY) || '');
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'APP'>('LANDING');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadStep, setLeadStep] = useState(1);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', jobTitle: '', companyName: '', companyPhone: '', city: '', employees: '1-10' });
  const [isPublicForm, setIsPublicForm] = useState(false);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [publicCompany, setPublicCompany] = useState<Company | null>(null);
  const [directChannel, setDirectChannel] = useState<FeedbackChannel | undefined>(undefined);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [error, setError] = useState('');

  const currentBusinessId = useMemo(() => {
    if (!user) return '';
    return dataStore.getActiveBusinessId(user, selectedCompanyId) || '';
  }, [user, selectedCompanyId]);

  useEffect(() => {
    if (selectedCompanyId) localStorage.setItem(ACTIVE_BUSINESS_KEY, selectedCompanyId);
    else localStorage.removeItem(ACTIVE_BUSINESS_KEY);
  }, [selectedCompanyId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');
    const source = params.get('src');
    if (code) {
      const company = dataStore.getCompanyByTrackingCode(code);
      if (company) { setPublicCompany(company); setIsPublicForm(true); setDirectChannel(source === 'qr' ? 'QR_CODE' : 'DIRECT_LINK'); }
      else { setTrackingCodeInput(code.toUpperCase()); setIsPublicForm(true); }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabaseClient.from('profiles').select('*');
      if (error) {
        console.error('Erro ao buscar perfis:', error);
      } else {
        console.log('Perfis carregados do Supabase:', data);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (user) {
      setView('APP');
      if (user.role === UserRole.BUSINESS || user.role === UserRole.USER) {
        setSelectedCompanyId(user.companyId || '');
      }
    }
  }, [user]);

  const handleLogout = () => { 
    localStorage.removeItem(ACTIVE_BUSINESS_KEY); 
    setUser(null); 
    setLoginEmail(''); 
    setLoginPass(''); 
    setError(''); 
    setView('AUTH'); 
    setSelectedCompanyId(''); 
  };

  const handleFeedbackSubmitted = () => { setIsPublicForm(false); setPublicCompany(null); setTrackingCodeInput(''); setDirectChannel(undefined); };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const authenticatedUser = dataStore.authenticate(loginEmail, loginPass);
    if (authenticatedUser) { 
      setUser(authenticatedUser); 
      setError(''); 
    }
    else { setError('Credenciais inválidas. Verifique e-mail e senha.'); }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmittingLead(true);
    setTimeout(() => {
      dataStore.addLead(leadForm); setIsSubmittingLead(false); setLeadSuccess(true);
      setTimeout(() => { setShowLeadModal(false); setLeadSuccess(false); setLeadStep(1); setLeadForm({ name: '', email: '', phone: '', jobTitle: '', companyName: '', companyPhone: '', city: '', employees: '1-10' }); }, 3000);
    }, 1500);
  };

  const LeadModal = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => !isSubmittingLead && setShowLeadModal(false)}></div>
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <button onClick={() => setShowLeadModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-all z-10"><X className="w-6 h-6" /></button>
        {leadSuccess ? (
          <div className="p-16 text-center space-y-6 animate-in zoom-in">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-12 h-12" /></div>
            <h3 className="text-2xl font-black text-slate-900 uppercase">Solicitação Enviada!</h3>
            <p className="text-slate-400 font-medium">Nossa equipe entrará em contato com você em até 24 horas úteis.</p>
          </div>
        ) : (
          <div className="p-10">
            <div className="mb-8 space-y-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Solicite uma demonstração</h3>
               <p className="text-sm text-slate-400 font-medium">Fale conosco e comece agora.</p>
            </div>
            <form onSubmit={leadStep === 1 ? (e) => { e.preventDefault(); setLeadStep(2); } : handleLeadSubmit} className="space-y-6">
              {leadStep === 1 ? (
                <div className="space-y-4 animate-in slide-in-from-right">
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label><div className="relative"><UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} type="text" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="Seu nome" /></div></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Corporativo</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} type="email" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="exemplo@empresa.com" /></div></div>
                  <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:bg-[#003680] transition-all uppercase tracking-widest text-xs">Continuar <ChevronRight className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right">
                   <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da Empresa</label><div className="relative"><Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.companyName} onChange={e => setLeadForm({...leadForm, companyName: e.target.value})} type="text" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="Nome do seu negócio" /></div></div>
                  <button type="submit" disabled={isSubmittingLead} className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:bg-[#003680] transition-all uppercase tracking-widest text-xs disabled:opacity-50">{isSubmittingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Solicitar Demonstração</>}</button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );

  if (isPublicForm) {
    if (!publicCompany) return <PublicEvaluationLanding initialCode={trackingCodeInput} onCompanyValidated={(c) => { setPublicCompany(c); setDirectChannel('MANUAL_CODE'); }} />;
    return <FeedbackForm company={publicCompany} initialChannel={directChannel} onFinished={handleFeedbackSubmitted} onBack={() => { setIsPublicForm(false); setPublicCompany(null); setDirectChannel(undefined); }} />;
  }
  if (view === 'LANDING') return <LandingPage onNavigate={() => setView('AUTH')} />;
  if (view === 'AUTH' && !user) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 font-inter text-slate-900 relative">
        {showLeadModal && <LeadModal />}
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30"><span className="text-3xl font-black text-white italic">A</span></div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ativare <span className="text-primary">Experience</span></h1>
          </div>
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
            <div className="p-10 space-y-8">
              <div className="text-center"><h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Acesse sua conta</h2><p className="text-xs text-slate-400 font-medium">Insira suas credenciais exclusivas Ativare.</p></div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail de Acesso</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-primary transition-all text-sm font-bold text-slate-900" placeholder="seu@email.com" required /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</label><div className="relative"><input type={showLoginPass ? "text" : "password"} value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full p-5 pr-14 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-primary transition-all text-sm font-bold text-slate-900" placeholder="••••••••" required /><button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">{showLoginPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                {error && <p className="text-red-500 text-xs font-bold uppercase text-center">{error}</p>}
                <div className="space-y-4">
                  <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl transition-all uppercase tracking-widest text-xs cursor-pointer hover:bg-[#003680]">Entrar no Sistema</button>
                  <button type="button" onClick={() => { setShowLeadModal(true); setLeadStep(1); setLeadSuccess(false); }} className="w-full py-4 text-primary font-black rounded-3xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary/5"><Sparkles className="w-4 h-4" /> Solicitar demonstração</button>
                  <button type="button" onClick={() => setView('LANDING')} className="w-full py-4 text-slate-300 font-black rounded-3xl transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:text-slate-400"><ArrowLeft className="w-3 h-3" /> Voltar para o site</button>
                </div>
              </form>
            </div>
            <div className="bg-slate-50 p-6 flex justify-center border-t border-slate-100"><button onClick={() => setIsPublicForm(true)} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer"><Search className="w-4 h-4" /> Avaliar com Código Público</button></div>
          </div>
        </div>
      </div>
    );
  }

  // LOGICA DE INTERCEPÇÃO: SE A ABA EXIGE UNIDADE E NÃO TEM SELECIONADA
  const isInternalUser = user?.role === UserRole.ADM_MASTER || user?.role === UserRole.GUARDIAN;
  const isSelectionRequired = isInternalUser && UNIT_BASED_TABS.includes(activeTab) && !currentBusinessId;

  return (
    <>
      {/* REQUISITO: Primeiro Acesso Obrigatório Overlay */}
      {user?.mustChangePassword && (
        <MandatoryPasswordChange 
          user={user} 
          onComplete={(updated) => {
            setUser(updated); // Atualiza sessão com mustChangePassword = false
          }} 
        />
      )}
      
      <Layout 
        user={user!} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedCompanyId={currentBusinessId}
        setSelectedCompanyId={setSelectedCompanyId}
      >
        {isSelectionRequired ? (
          <BusinessSelector user={user!} onSelect={setSelectedCompanyId} />
        ) : (
          <>
            {activeTab === 'dashboard' && (user?.role === UserRole.ADM_MASTER ? <MasterFinance /> : <Dashboard companyId={currentBusinessId} />)}
            {activeTab === 'master_clients' && <MasterClients currentUser={user!} />}
            {activeTab === 'master_leads' && <MasterLeads currentUser={user!} />}
            {activeTab === 'master_admin_console' && <MasterAdminPanel currentUser={user!} />}
            {activeTab === 'cases' && <CaseManagement companyId={currentBusinessId} currentUser={user!} />}
            {activeTab === 'feedbacks' && <Feedbacks companyId={currentBusinessId} currentUser={user!} />}
            {activeTab === 'customers' && <Customers companyId={currentBusinessId} currentUser={user!} />}
            {activeTab === 'form_config' && <InternalFormConfig companyId={currentBusinessId} />}
            {activeTab === 'internal_metrics' && <InternalMetrics companyId={currentBusinessId} />}
            {activeTab === 'company_profile' && <CompanyProfile companyId={currentBusinessId} currentUser={user!} />}
            {activeTab === 'my_profile' && <UserProfile user={user!} onUpdate={(u) => setUser(u)} />}
            {activeTab === 'users_team' && <UsersTeam companyId={currentBusinessId} currentUser={user!} />}
            {activeTab === 'my_account' && <AccountBilling companyId={currentBusinessId} />}
            {activeTab === 'benchmarking' && <Benchmarking companyId={currentBusinessId} />}
            {activeTab === 'growth' && <Growth companyId={currentBusinessId} />}
            {activeTab === 'bi' && <BI companyId={currentBusinessId} />}
          </>
        )}
      </Layout>
    </>
  );
};

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Company, JobTitle } from './types';
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
import MasterCSDashboard from './components/MasterCSDashboard';
import MasterAdminPanel from './components/MasterAdminPanel';
import { 
  LogIn, 
  ShieldAlert, 
  Rocket, 
  Store, 
  ChevronLeft, 
  ChevronRight, 
  QrCode, 
  Search, 
  User as UserIcon,
  Camera,
  Briefcase,
  Smartphone,
  Mail,
  FileText,
  MapPin,
  Users,
  Lock,
  ArrowLeft,
  Sparkles,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { dataStore } from './services/dataStore';

const MandatoryPasswordChange: React.FC<{ user: User, onComplete: (updatedUser: User) => void }> = ({ user, onComplete }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPass.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    // Simulação de delay para experiência de segurança
    setTimeout(() => {
      const updated = dataStore.completeMandatoryPasswordChange(user.id, newPass);
      if (updated) {
        // O onComplete irá atualizar o estado 'user' no App.tsx
        onComplete(updated);
      } else {
        setError('Ocorreu um erro ao atualizar a senha.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 font-inter">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="p-12 space-y-8">
           <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">Segurança Obrigatória</h2>
                <p className="text-slate-400 font-medium text-sm mt-2">Olá <span className="text-primary font-bold">{user.name}</span>, por segurança, você deve definir uma senha definitiva para seu primeiro acesso.</p>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nova Senha</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required 
                      type={showPass ? "text" : "password"} 
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all"
                      placeholder="Sua nova senha"
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

              {error && <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

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
           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">Você só poderá utilizar os recursos do Ativare Experience após esta atualização.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'APP'>('LANDING');

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadStep, setLeadStep] = useState(1);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '', email: '', phone: '', jobTitle: '', companyName: '', companyPhone: '', city: '', employees: '1-10'
  });

  const [isPublicForm, setIsPublicForm] = useState(false);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [publicCompany, setPublicCompany] = useState<Company | null>(null);
  const [publicError, setPublicError] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState('');
  
  const [hasDetractorAlert, setHasDetractorAlert] = useState(false);

  useEffect(() => {
    if (user) {
      setView('APP');
      if (user.role === UserRole.ADM_MASTER) {
        setSelectedCompanyId(dataStore.getAllCompanies()[0]?.id || '');
      } else if (user.role === UserRole.GUARDIAN) {
        setSelectedCompanyId(user.linkedCompanyIds?.[0] || '');
      } else if (user.companyId) {
        setSelectedCompanyId(user.companyId);
      }
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null); setLoginEmail(''); setLoginPass(''); setError(''); setView('AUTH');
  };

  const handleFeedbackSubmitted = () => { setIsPublicForm(false); setPublicCompany(null); setTrackingCodeInput(''); };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const authenticatedUser = dataStore.authenticate(loginEmail, loginPass);
    if (authenticatedUser) { setUser(authenticatedUser); setError(''); } else { setError('Credenciais inválidas. Verifique e-mail e senha.'); }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmittingLead(true);
    setTimeout(() => {
      dataStore.addLead(leadForm); setIsSubmittingLead(false); setLeadSuccess(true);
      setTimeout(() => {
        setShowLeadModal(false); setLeadSuccess(false); setLeadStep(1);
        setLeadForm({ name: '', email: '', phone: '', jobTitle: '', companyName: '', companyPhone: '', city: '', employees: '1-10' });
      }, 3000);
    }, 1500);
  };

  const handleTrackingCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setIsRouting(true); setPublicError('');
    setTimeout(() => {
      const company = dataStore.getCompanyByTrackingCode(trackingCodeInput);
      if (company) { setPublicCompany(company); setIsRouting(false); } else { setPublicError('Código não encontrado. Verifique o código de 6 dígitos.'); setIsRouting(false); }
    }, 800);
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
               <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-1.5 rounded-full transition-all ${leadStep === 1 ? 'bg-primary' : 'bg-emerald-500'}`}></div>
                  <div className={`w-8 h-1.5 rounded-full transition-all ${leadStep === 2 ? 'bg-primary' : 'bg-slate-100'}`}></div>
               </div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Solicite uma demonstração</h3>
               <p className="text-sm text-slate-400 font-medium">{leadStep === 1 ? 'Primeiro, fale um pouco sobre você.' : 'Agora, conte-nos sobre sua empresa.'}</p>
            </div>
            <form onSubmit={leadStep === 1 ? (e) => { e.preventDefault(); setLeadStep(2); } : handleLeadSubmit} className="space-y-6">
              {leadStep === 1 ? (
                <div className="space-y-4 animate-in slide-in-from-right">
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label><div className="relative"><UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} type="text" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="Seu nome" /></div></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Corporativo</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} type="email" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="exemplo@empresa.com" /></div></div>
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefone</label><div className="relative"><Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} type="tel" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="(00) 00000-0000" /></div></div><div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cargo</label><select required value={leadForm.jobTitle} onChange={e => setLeadForm({...leadForm, jobTitle: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm appearance-none"><option value="">Selecionar...</option><option value="Dono">Dono / CEO</option><option value="Gerente">Gerente</option><option value="Marketing">Marketing / CX</option></select></div></div>
                  <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:bg-[#003680] transition-all uppercase tracking-widest text-xs">Continuar <ChevronRight className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right">
                   <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da Empresa</label><div className="relative"><Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.companyName} onChange={e => setLeadForm({...leadForm, companyName: e.target.value})} type="text" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="Nome do seu negócio" /></div></div>
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefone Empresa</label><input required value={leadForm.companyPhone} onChange={e => setLeadForm({...leadForm, companyPhone: e.target.value})} type="tel" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="(00) 0000-0000" /></div><div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cidade</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input required value={leadForm.city} onChange={e => setLeadForm({...leadForm, city: e.target.value})} type="text" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm" placeholder="Ex: São Paulo" /></div></div></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Número de Funcionários</label><select required value={leadForm.employees} onChange={e => setLeadForm({...leadForm, employees: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 text-sm appearance-none"><option value="1-10">1 a 10 funcionários</option><option value="11-50">11 a 50 funcionários</option><option value="51-200">51 a 200 funcionários</option><option value="200+">Mais de 200 funcionários</option></select></div>
                  <div className="flex gap-3 pt-2"><button type="button" onClick={() => setLeadStep(1)} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Voltar</button><button type="submit" disabled={isSubmittingLead} className="flex-1 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:bg-[#003680] transition-all uppercase tracking-widest text-xs disabled:opacity-50">{isSubmittingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Solicitar Demonstração</>}</button></div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );

  if (isPublicForm) {
    if (!publicCompany) {
      return (
        <div className="min-h-screen bg-[#001529] flex items-center justify-center p-6 font-inter text-slate-900">
          <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl p-12 text-center animate-in zoom-in duration-500 border border-white/10"><div className="w-24 h-24 bg-primary/5 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><QrCode className={`w-12 h-12 ${isRouting ? 'animate-pulse' : ''}`} /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Portal Ativare</h2><p className="text-slate-400 font-medium mb-10 text-sm">Insira o código público de 6 dígitos para avaliar.</p><form onSubmit={handleTrackingCodeSubmit} className="space-y-8"><input type="text" maxLength={6} disabled={isRouting} value={trackingCodeInput} onChange={(e) => setTrackingCodeInput(e.target.value.toUpperCase())} placeholder="ABC123" className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-primary text-center text-4xl font-black tracking-[0.4em] text-primary transition-all uppercase" />{publicError && <p className="text-red-500 text-xs font-bold uppercase">{publicError}</p>}<button type="submit" disabled={trackingCodeInput.length < 6 || isRouting} className="w-full py-6 bg-primary text-white font-black rounded-[2rem] shadow-2xl shadow-primary/30 transition-all disabled:opacity-20 uppercase tracking-widest text-xs cursor-pointer">{isRouting ? 'Localizando...' : 'Carregar Avaliação'}</button></form><button onClick={() => setIsPublicForm(false)} className="mt-12 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto cursor-pointer"><ChevronLeft className="w-4 h-4" /> Voltar</button></div>
        </div>
      );
    }
    return <FeedbackForm company={publicCompany} onFinished={handleFeedbackSubmitted} onBack={() => { setIsPublicForm(false); setPublicCompany(null); }} />;
  }

  if (view === 'LANDING') return <LandingPage onNavigate={(v) => { setView('AUTH'); }} />;

  if (view === 'AUTH' && !user) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 font-inter text-slate-900 relative">
        {showLeadModal && <LeadModal />}
        <div className="max-w-md w-full"><div className="text-center mb-10"><div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30"><span className="text-3xl font-black text-white italic">A</span></div><h1 className="text-4xl font-black text-slate-900 tracking-tight">Ativare <span className="text-primary">Experience</span></h1></div><div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white"><div className="p-10 space-y-8"><div className="text-center"><h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Acesse sua conta</h2><p className="text-xs text-slate-400 font-medium">Insira suas credenciais exclusivas Ativare.</p></div><form onSubmit={handleLogin} className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail de Acesso</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-primary transition-all text-sm font-bold text-slate-900" placeholder="seu@email.com" required /></div><div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</label><input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-primary transition-all text-sm font-bold text-slate-900" placeholder="••••••••" required /></div>{error && <p className="text-red-500 text-xs font-bold uppercase text-center">{error}</p>}<div className="space-y-4"><button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl transition-all uppercase tracking-widest text-xs cursor-pointer hover:bg-[#003680]">Entrar no Sistema</button><button type="button" onClick={() => { setShowLeadModal(true); setLeadStep(1); setLeadSuccess(false); }} className="w-full py-4 text-primary font-black rounded-3xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary/5"><Sparkles className="w-4 h-4" /> Não tem acesso ainda? Solicite uma demonstração</button><button type="button" onClick={() => setView('LANDING')} className="w-full py-4 text-slate-300 font-black rounded-3xl transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:text-slate-400"><ArrowLeft className="w-3 h-3" /> Voltar para o site</button></div><div className="pt-6 border-t border-slate-50 flex flex-col items-center gap-4"><p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Acesso Master e Guardião (Senha: 123)</p><div className="flex gap-2"><button type="button" onClick={() => { setLoginEmail('master@ativare.com'); setLoginPass('123'); }} className="px-4 py-2 bg-slate-100 text-[8px] font-black uppercase rounded-lg text-slate-500 hover:bg-slate-200 cursor-pointer">Login Master</button><button type="button" onClick={() => { setLoginEmail('guardiao@ativare.com'); setLoginPass('123'); }} className="px-4 py-2 bg-slate-100 text-[8px] font-black uppercase rounded-lg text-slate-500 hover:bg-slate-200 cursor-pointer">Login Guardião</button></div></div></form></div><div className="bg-slate-50 p-6 flex justify-center border-t border-slate-100"><button onClick={() => setIsPublicForm(true)} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline cursor-pointer"><Search className="w-4 h-4" /> Avaliar com Código Público</button></div></div></div>
      </div>
    );
  }

  return (
    <>
      {user?.mustChangePassword && (
        <MandatoryPasswordChange user={user} onComplete={(updated) => {
          setUser(updated);
          // O redirecionamento acontece naturalmente pois o MandatoryPasswordChange desmonta
        }} />
      )}
      <Layout 
        user={user!} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedCompanyId={selectedCompanyId}
        setSelectedCompanyId={setSelectedCompanyId}
        hasDetractorAlert={hasDetractorAlert}
      >
        {activeTab === 'dashboard' ? (
          user?.role === UserRole.ADM_MASTER ? <MasterFinance /> : <Dashboard companyId={selectedCompanyId} />
        ) : null}
        {activeTab === 'master_clients' && <MasterClients currentUser={user!} />}
        {activeTab === 'master_leads' && <MasterLeads currentUser={user!} />}
        {activeTab === 'master_admin_console' && <MasterAdminPanel currentUser={user!} />}
        {activeTab === 'cases' && <CaseManagement companyId={selectedCompanyId} currentUser={user!} />}
        {activeTab === 'feedbacks' && <Feedbacks companyId={selectedCompanyId} currentUser={user!} />}
        {activeTab === 'customers' && <Customers companyId={selectedCompanyId} currentUser={user!} />}
        {activeTab === 'form_config' && <InternalFormConfig companyId={selectedCompanyId} />}
        {activeTab === 'internal_metrics' && <InternalMetrics companyId={selectedCompanyId} />}
        {activeTab === 'company_profile' && <CompanyProfile companyId={selectedCompanyId} currentUser={user!} />}
        {activeTab === 'my_profile' && <UserProfile user={user!} onUpdate={(updated) => setUser(updated)} />}
        {activeTab === 'users_team' && <UsersTeam companyId={selectedCompanyId} currentUser={user!} />}
        {activeTab === 'my_account' && <AccountBilling companyId={selectedCompanyId} />}
        {activeTab === 'benchmarking' && <Benchmarking companyId={selectedCompanyId} />}
        {activeTab === 'bi' && <BI companyId={selectedCompanyId} />}
      </Layout>
    </>
  );
};

export default App;

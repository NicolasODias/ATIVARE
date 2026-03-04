
import React, { useState } from 'react';
import { dataStore } from '../services/dataStore';
import { Company, User, JobTitle, PlanType } from '../types';
import { 
  Store, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Lock,
  Hash,
  ShieldCheck,
  Zap,
  Star,
  Sparkles,
  AlertTriangle,
  User as UserIcon,
  Loader2,
  Users2
} from 'lucide-react';

const MasterClients: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{company: Company, user: User} | null>(null);

  const [companyForm, setCompanyForm] = useState({
    name: '',
    address: '',
    cnpj: '',
    employees: '1-10',
    city: '',
    phone: '',
    email: '',
    category: 'Restaurante',
    plan: 'PRO' as PlanType,
    trackingCode: '' 
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: 'Dono' as JobTitle,
    password: Math.random().toString(36).substring(2, 10) 
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const result = dataStore.createAccountManual(companyForm, userForm, currentUser.name);
      setLoading(false);
      setSuccessData(result);
    }, 1500);
  };

  const reset = () => {
    setStep(1);
    setSuccessData(null);
    setCompanyForm({ name: '', address: '', cnpj: '', employees: '1-10', city: '', phone: '', email: '', category: 'Restaurante', plan: 'PRO', trackingCode: '' });
    setUserForm({ name: '', email: '', phone: '', jobTitle: 'Dono', password: Math.random().toString(36).substring(2, 10) });
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in zoom-in">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
           <Check className="w-12 h-12" />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Cliente Provisionado!</h2>
           <p className="text-slate-400 font-medium mt-2">O estabelecimento e o acesso administrativo foram criados com sucesso.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 text-left">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-widest border-b border-slate-50 pb-2">Credenciais do Responsável</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">E-mail de Login</p>
                    <p className="text-sm font-black text-slate-800">{successData.user.email}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Senha Temporária</p>
                    <p className="text-sm font-black text-primary">{userForm.password}</p>
                 </div>
              </div>
           </div>
           
           <div className="space-y-4 pt-4 border-t border-slate-50">
              <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-widest border-b border-slate-50 pb-2">Dados do Negócio</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Código Público Ativare</p>
                    <p className="text-lg font-black text-slate-900 tracking-widest">{successData.company.trackingCode}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Plano Vinculado</p>
                    <p className="text-lg font-black text-emerald-500 uppercase">{successData.company.plan}</p>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-3 border border-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <p className="text-[10px] font-bold text-amber-700 uppercase leading-relaxed">
                 O usuário gestor será forçado a trocar esta senha no primeiro login. Informe-o sobre o link de acesso exclusivo.
              </p>
           </div>
        </div>

        <button onClick={reset} className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-widest text-xs hover:scale-105 transition-all">Realizar Novo Cadastro</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-primary text-white rounded-[2rem] shadow-xl shadow-primary/20"><Users2 className="w-8 h-8" /></div>
            <div>
               <h2 className="text-2xl font-black text-slate-900">Novo Cliente</h2>
               <p className="text-slate-400 font-medium">Provisione uma nova conta master para um cliente contratante.</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${step === 1 ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-emerald-500 text-white'}`}>{step > 1 ? <Check className="w-5 h-5" /> : '1'}</div>
            <div className="w-6 h-0.5 bg-slate-100"></div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${step === 2 ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-50 text-slate-300'}`}>2</div>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleCreate} className="p-10 space-y-10">
          {step === 1 ? (
            <div className="space-y-10 animate-in slide-in-from-right">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-slate-50 text-primary rounded-2xl"><Building className="w-6 h-6" /></div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase">1. Dados do Estabelecimento</h3>
                    <p className="text-xs text-slate-400 font-medium">Informações de contrato e faturamento do negócio.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Comercial do Negócio</label>
                  <input required value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="Ex: Café da Vila" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">CNPJ</label>
                  <input required value={companyForm.cnpj} onChange={e => setCompanyForm({...companyForm, cnpj: e.target.value})} type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cidade e Estado</label>
                  <input required value={companyForm.city} onChange={e => setCompanyForm({...companyForm, city: e.target.value})} type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="Poços de Caldas - MG" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Telefone Comercial</label>
                  <input required value={companyForm.phone} onChange={e => setCompanyForm({...companyForm, phone: e.target.value})} type="tel" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="(00) 0000-0000" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Código Público (Identificador Único)</label>
                   <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required 
                        value={companyForm.trackingCode} 
                        onChange={e => setCompanyForm({...companyForm, trackingCode: e.target.value.toUpperCase()})} 
                        type="text" 
                        maxLength={6}
                        className="w-full pl-12 pr-4 py-4 bg-primary/5 border border-primary/20 rounded-2xl outline-none focus:border-primary font-black text-primary tracking-widest transition-all" 
                        placeholder="ABC123" 
                      />
                   </div>
                   <p className="text-[9px] text-slate-400 font-medium ml-1">Código de 6 caracteres usado para o formulário público.</p>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Endereço Completo</label>
                   <input required value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="Rua, Número, Bairro - Complemento" />
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Configuração de Plano e Acesso</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setCompanyForm({...companyForm, plan: 'PRO'})}
                      className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${companyForm.plan === 'PRO' ? 'bg-primary/5 border-primary text-primary shadow-lg' : 'bg-white border-slate-100 text-slate-300'}`}
                    >
                       <div className={`p-3 rounded-xl ${companyForm.plan === 'PRO' ? 'bg-primary text-white' : 'bg-slate-50'}`}><Star className="w-6 h-6" /></div>
                       <div className="text-left">
                          <p className="text-sm font-black uppercase">Plano Profissional</p>
                          <p className="text-[10px] font-medium opacity-60">Até 500 avaliações/mês</p>
                       </div>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCompanyForm({...companyForm, plan: 'ENTERPRISE'})}
                      className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${companyForm.plan === 'ENTERPRISE' ? 'bg-accent/5 border-accent text-accent shadow-lg' : 'bg-white border-slate-100 text-slate-300'}`}
                    >
                       <div className={`p-3 rounded-xl ${companyForm.plan === 'ENTERPRISE' ? 'bg-accent text-white' : 'bg-slate-50'}`}><Zap className="w-6 h-6" /></div>
                       <div className="text-left">
                          <p className="text-sm font-black uppercase">Plano Enterprise</p>
                          <p className="text-[10px] font-medium opacity-60">Avaliações Ilimitadas e Suporte Full</p>
                       </div>
                    </button>
                 </div>
              </div>

              <div className="flex justify-end pt-6">
                <button type="button" onClick={() => setStep(2)} className="px-12 py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 flex items-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-all">
                  Próximo: Dados do Responsável <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in slide-in-from-right">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-slate-50 text-primary rounded-2xl"><UserIcon className="w-6 h-6" /></div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase">2. Responsável pelo Negócio</h3>
                    <p className="text-xs text-slate-400 font-medium">Configure quem será o gestor principal com acesso total à empresa.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo do Gestor</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="Ex: Rodrigo Oliveira" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail de Login Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="gestor@empresa.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cargo / Função</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select value={userForm.jobTitle} onChange={e => setUserForm({...userForm, jobTitle: e.target.value as JobTitle})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 appearance-none transition-all">
                      <option value="Dono">Dono / Proprietário</option>
                      <option value="Gerente">Gerente Geral</option>
                      <option value="Sub-gerente">Gestor de Atendimento</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp Pessoal</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} type="tel" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Senha de Primeiro Acesso (Provisória)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} type="text" className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-black text-slate-900 tracking-widest transition-all" />
                    <button type="button" onClick={() => setUserForm({...userForm, password: Math.random().toString(36).substring(2, 10)})} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white text-primary rounded-lg shadow-sm hover:bg-primary/5 transition-all"><Sparkles className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-start gap-4 shadow-inner">
                 <ShieldCheck className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                 <div>
                    <p className="text-sm font-black text-primary uppercase tracking-tight">Segurança Ativare Experience</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                       O gestor cadastrado receberá um convite de acesso. No primeiro login, o sistema exigirá obrigatoriamente a troca da senha provisória por uma senha definitiva e complexa.
                    </p>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-6">
                <button type="button" onClick={() => setStep(1)} className="px-8 py-5 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-all flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Voltar para Negócio
                </button>
                <button type="submit" disabled={loading} className="px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Confirmar e Criar Conta</>}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MasterClients;

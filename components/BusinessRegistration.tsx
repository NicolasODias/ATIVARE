
import React, { useState, useEffect } from 'react';
import { dataStore } from '../services/dataStore';
import { Company, User, PlanType, JobTitle } from '../types';
import { 
  Building, 
  Mail, 
  Lock, 
  Check, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  Chrome,
  Hash,
  MapPin,
  Phone,
  Briefcase,
  Sparkles
} from 'lucide-react';

const BusinessRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingCode] = useState(dataStore.generateUniqueTrackingCode());

  const [companyForm, setCompanyForm] = useState({
    name: '',
    address: '',
    cnpj: '',
    city: '',
    phone: '',
    email: '',
    category: 'Restaurante',
    plan: 'PRO' as PlanType,
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: 'Dono' as JobTitle,
    password: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      dataStore.registerBusiness(
        { ...companyForm, trackingCode },
        userForm
      );
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Mock Google Login
    setTimeout(() => {
      setUserForm({
        ...userForm,
        name: 'Usuário Google',
        email: 'google@example.com',
      });
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center space-y-8 animate-in zoom-in">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Conta Criada!</h2>
            <p className="text-slate-400 font-medium mt-2">Seja bem-vindo à Ativare Experience. Seu negócio já está pronto para começar.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seu Código Público</p>
              <p className="text-2xl font-black text-primary tracking-widest">{trackingCode}</p>
            </div>
            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
              Use este código para que seus clientes acessem seu formulário de avaliação.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-widest text-xs hover:scale-105 transition-all"
          >
            Acessar Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Novo Cadastro de Negócio</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Comece sua jornada hoje.</h1>
          <p className="text-slate-400 font-medium">Crie sua conta master e transforme a experiência dos seus clientes.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <div className={`flex-1 py-6 text-center text-[10px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'text-primary border-b-2 border-primary' : 'text-slate-300'}`}>1. Identificação</div>
            <div className={`flex-1 py-6 text-center text-[10px] font-black uppercase tracking-widest transition-all ${step === 2 ? 'text-primary border-b-2 border-primary' : 'text-slate-300'}`}>2. O Negócio</div>
          </div>

          <form onSubmit={handleRegister} className="p-10 space-y-8">
            {step === 1 ? (
              <div className="space-y-8 animate-in slide-in-from-right">
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-red-500" />}
                    Cadastrar com Google
                  </button>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">Ou use seu e-mail</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Seu Nome Completo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required 
                        type="text" 
                        value={userForm.name}
                        onChange={e => setUserForm({...userForm, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" 
                        placeholder="Ex: João Silva" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required 
                        type="email" 
                        value={userForm.email}
                        onChange={e => setUserForm({...userForm, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" 
                        placeholder="seu@email.com" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Crie uma Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required 
                        type="password" 
                        value={userForm.password}
                        onChange={e => setUserForm({...userForm, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  disabled={!userForm.name || !userForm.email || !userForm.password}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50"
                >
                  Próximo Passo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome do Negócio</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input required type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="Ex: Café Central" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">CNPJ (Opcional)</label>
                    <input type="text" value={companyForm.cnpj} onChange={e => setCompanyForm({...companyForm, cnpj: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="00.000.000/0000-00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cidade</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input required type="text" value={companyForm.city} onChange={e => setCompanyForm({...companyForm, city: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="Sua Cidade" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp Comercial</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input required type="tel" value={companyForm.phone} onChange={e => setCompanyForm({...companyForm, phone: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Seu Código Público Gerado</p>
                    <p className="text-xl font-black text-slate-900 tracking-widest">{trackingCode}</p>
                  </div>
                  <Hash className="w-8 h-8 text-primary/20" />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Voltar</button>
                  <button 
                    type="submit" 
                    disabled={loading || !companyForm.name || !companyForm.city || !companyForm.phone}
                    className="flex-[2] py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Concluir Cadastro</>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Seguro Ativare Experience</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration;

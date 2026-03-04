
import React, { useState, useRef } from 'react';
import { Company, User, UserRole, JobTitle } from '../types';
import { dataStore } from '../services/dataStore';
import { 
  Store, 
  Camera, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  User as UserIcon, 
  FileText, 
  Briefcase, 
  AlertTriangle, 
  X, 
  Clock, 
  Hash, 
  Copy, 
  Check,
  Users,
  Info,
  Smartphone
} from 'lucide-react';

interface CompanyProfileProps {
  companyId: string;
  currentUser: User;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyId, currentUser }) => {
  const company = dataStore.getCompany(companyId);
  const [companyForm, setCompanyForm] = useState<Partial<Company>>(company || {});
  const [userForm, setUserForm] = useState<Partial<User>>(currentUser || {});
  const [isSaved, setIsSaved] = useState(false);
  const [showCNPJModal, setShowCNPJModal] = useState(false);
  const [cnpjReason, setCnpjReason] = useState('');
  const [newRequestedCNPJ, setNewRequestedCNPJ] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userPhotoRef = useRef<HTMLInputElement>(null);

  if (!company) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.updateCompany(companyId, companyForm);
    dataStore.updateUser(currentUser.id, userForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'LOGO' | 'USER_PHOTO') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'LOGO') setCompanyForm(prev => ({ ...prev, logo: base64String }));
        else setUserForm(prev => ({ ...prev, profilePhoto: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(company.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCNPJRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpjReason || !newRequestedCNPJ) return;
    
    setIsRequesting(true);
    dataStore.requestCNPJChange(companyId, {
      userId: currentUser.id,
      userName: currentUser.name,
      requestedCNPJ: newRequestedCNPJ,
      reason: cnpjReason
    });

    setTimeout(() => {
      setIsRequesting(false);
      setShowCNPJModal(false);
      setCnpjReason('');
      setNewRequestedCNPJ('');
      alert('Solicitação enviada com sucesso para análise do Master.');
    }, 1000);
  };

  const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", readOnly = false }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input 
        type={type}
        value={value || ''}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 border rounded-2xl outline-none transition-all font-bold text-slate-900 ${
          readOnly 
            ? 'bg-slate-100 border-slate-100 cursor-not-allowed text-slate-400' 
            : 'bg-slate-50 border-slate-200 focus:border-primary'
        }`}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-500">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'LOGO')} />
        <input type="file" ref={userPhotoRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'USER_PHOTO')} />

        {/* Header / Logo Section */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 shadow-xl bg-slate-50 flex items-center justify-center">
              {companyForm.logo ? (
                <img src={companyForm.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-12 h-12 text-slate-200" />
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all z-10">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{companyForm.name}</h2>
              <p className="text-slate-400 font-medium">Gestão centralizada do perfil do seu negócio e responsáveis.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Código Público</span>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-sm font-black text-primary tracking-[0.1em]">{company.trackingCode}</span>
                    <button type="button" onClick={handleCopyCode} className={`p-1 rounded-lg transition-all ${copied ? 'text-emerald-500' : 'text-slate-300 hover:text-primary'}`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Business Details Section */}
        <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <div className="p-2 bg-slate-50 rounded-xl text-primary"><Store className="w-5 h-5" /></div>
             Dados do Negócio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <Info className="w-3 h-3" /> Descrição do Negócio
               </label>
               <textarea 
                 value={companyForm.description || ''} 
                 onChange={e => setCompanyForm({...companyForm, description: e.target.value})}
                 className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-medium text-slate-900 text-sm"
               />
            </div>
            
            <InputField label="Nome Comercial" icon={Store} value={companyForm.name} onChange={(v: string) => setCompanyForm({...companyForm, name: v})} />
            <InputField label="Categoria" icon={Briefcase} value={companyForm.category} onChange={(v: string) => setCompanyForm({...companyForm, category: v})} />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText className="w-3 h-3" /> CNPJ
              </label>
              <div className="flex gap-2">
                <input type="text" value={companyForm.cnpj || ''} readOnly className="flex-1 p-4 bg-slate-100 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed" />
                <button type="button" onClick={() => setShowCNPJModal(true)} className="px-4 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all whitespace-nowrap">Solicitar Alteração</button>
              </div>
            </div>

            <InputField label="Nº de Colaboradores" icon={Users} value={companyForm.employees} onChange={(v: string) => setCompanyForm({...companyForm, employees: v})} />
            <div className="md:col-span-2"><InputField label="Endereço" icon={MapPin} value={companyForm.address} onChange={(v: string) => setCompanyForm({...companyForm, address: v})} /></div>
            <InputField label="Telefone Comercial" icon={Phone} value={companyForm.phone} onChange={(v: string) => setCompanyForm({...companyForm, phone: v})} />
            <InputField label="E-mail Comercial" icon={Mail} value={companyForm.email} onChange={(v: string) => setCompanyForm({...companyForm, email: v})} />
          </div>
        </section>

        {/* Responsible Person Section */}
        <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <div className="p-2 bg-slate-50 rounded-xl text-primary"><UserIcon className="w-5 h-5" /></div>
             Pessoa Responsável
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
               <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg bg-slate-50 flex items-center justify-center">
                  {userForm.profilePhoto ? (
                    <img src={userForm.profilePhoto} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-slate-200" />
                  )}
               </div>
               <button type="button" onClick={() => userPhotoRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-all z-10">
                  <Camera className="w-4 h-4" />
               </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <InputField label="Nome Completo" icon={UserIcon} value={userForm.name} onChange={(v: string) => setUserForm({...userForm, name: v})} />
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Cargo
                  </label>
                  <select 
                    value={userForm.jobTitle} 
                    onChange={e => setUserForm({...userForm, jobTitle: e.target.value as JobTitle})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
                  >
                    <option value="Dono">Dono</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Sub-gerente">Sub-gerente</option>
                  </select>
               </div>
               <InputField label="WhatsApp Pessoal" icon={Smartphone} value={userForm.phone} onChange={(v: string) => setUserForm({...userForm, phone: v})} />
               <InputField label="E-mail de Contato" icon={Mail} value={userForm.email} onChange={(v: string) => setUserForm({...userForm, email: v})} />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button type="submit" className={`px-12 py-5 bg-primary text-white font-black rounded-3xl shadow-xl transition-all flex items-center gap-3 ${isSaved ? 'bg-emerald-500' : 'hover:-translate-y-1'}`}>
            {isSaved ? <><Check className="w-5 h-5" /> Perfil Salvo!</> : <><Save className="w-5 h-5" /> Salvar Alterações</>}
          </button>
        </div>
      </form>

      {/* CNPJ Change Modal */}
      {showCNPJModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isRequesting && setShowCNPJModal(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative z-10 shadow-2xl border border-white animate-in zoom-in duration-300">
            <button onClick={() => setShowCNPJModal(false)} className="absolute top-8 right-8 text-slate-400"><X className="w-6 h-6" /></button>
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mb-6"><AlertTriangle className="w-10 h-10" /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Solicitar Alteração de CNPJ</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">A alteração deve ser aprovada pela equipe Master por segurança.</p>
            <form onSubmit={handleCNPJRequest} className="space-y-6">
              <InputField label="Novo CNPJ" icon={FileText} value={newRequestedCNPJ} onChange={(v: string) => setNewRequestedCNPJ(v)} placeholder="00.000.000/0000-00" />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Motivo</label>
                <textarea required value={cnpjReason} onChange={(e) => setCnpjReason(e.target.value)} className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary font-medium text-slate-900" />
              </div>
              <button type="submit" disabled={isRequesting} className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl disabled:opacity-50">
                {isRequesting ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;

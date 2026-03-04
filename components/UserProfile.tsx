
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { dataStore } from '../services/dataStore';
import { User as UserIcon, Camera, Save, Mail, Phone, Lock, Check, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    phone: user.phone,
    profilePhoto: user.profilePhoto
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  // Apenas o ADM_MASTER pode ver e usar a seção de troca de senha no perfil
  const isMaster = user.role === UserRole.ADM_MASTER;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = dataStore.updateUser(user.id, formData);
    if (updated) {
      onUpdate(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (passwordData.new !== passwordData.confirm) {
      setPassError('As novas senhas não coincidem.');
      return;
    }

    const success = dataStore.updatePassword(user.id, passwordData.current, passwordData.new);
    if (success) {
      setPassSuccess(true);
      setPasswordData({ current: '', new: '', confirm: '' });
    } else {
      setPassError('Senha atual incorreta.');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-10">
          <div className="relative group">
             <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 shadow-xl bg-slate-50 flex items-center justify-center">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0047a7&color=fff`} className="w-full h-full" alt="Avatar" />
                )}
             </div>
             <button 
                type="button" 
                onClick={() => photoInputRef.current?.click()}
                className="absolute bottom-[-10px] right-[-10px] p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all z-10"
              >
                <Camera className="w-5 h-5" />
             </button>
             <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
          </div>

          <div className="flex-1">
             <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
             <p className="text-slate-400 font-medium">Configure seus dados pessoais e foto de identificação.</p>
             <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-full">ID: {user.id}</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">{user.staffRole || user.role}</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <UserIcon className="w-3 h-3" /> Nome Completo
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> E-mail de Acesso
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Phone className="w-3 h-3" /> WhatsApp / Telefone
              </label>
              <input 
                type="tel" 
                value={formData.phone || ''}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
              />
           </div>
           
           <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit" 
                className={`px-8 py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 ${isSaved ? 'bg-emerald-500' : 'bg-primary hover:scale-105'}`}
              >
                {isSaved ? <><Check className="w-5 h-5" /> Dados Salvos!</> : <><Save className="w-5 h-5" /> Atualizar Perfil</>}
              </button>
           </div>
        </form>
      </section>

      {/* Seção de Alterar Senha - Restrita ao ADM Master conforme requisito */}
      {isMaster ? (
        <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Lock className="w-5 h-5" /></div>
             <div>
               <h3 className="text-xl font-black text-slate-900">Segurança da Conta (Master)</h3>
               <p className="text-slate-400 font-medium">Como Master, você pode gerenciar sua própria senha aqui.</p>
             </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Senha Atual</label>
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"}
                    required
                    value={passwordData.current}
                    onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                     {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nova Senha</label>
                   <input 
                     type="password"
                     required
                     value={passwordData.new}
                     onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confirmar Nova Senha</label>
                   <input 
                     type="password"
                     required
                     value={passwordData.confirm}
                     onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900"
                   />
                </div>
             </div>

             {passError && (
               <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-red-600 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4" /> {passError}
               </div>
             )}

             {passSuccess && (
               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-600 text-xs font-bold">
                  <Check className="w-4 h-4" /> Senha alterada com sucesso!
               </div>
             )}

             <button 
               type="submit" 
               className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-xs"
             >
               Alterar Senha
             </button>
          </form>
        </section>
      ) : (
        <section className="bg-slate-50 rounded-[3rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300">
              <Lock className="w-8 h-8" />
           </div>
           <div className="max-w-xs">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Gestão de Credenciais Restrita</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2">
                Apenas o administrador **Master** possui permissão para redefinir senhas de contas de clientes. Caso precise trocar sua senha, entre em contato com o suporte Ativare.
              </p>
           </div>
        </section>
      )}
    </div>
  );
};

export default UserProfile;

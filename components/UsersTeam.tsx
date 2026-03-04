
import React, { useState, useMemo } from 'react';
import { User, StaffRole } from '../types';
import { dataStore } from '../services/dataStore';
import { Users, Plus, Mail, Shield, ShieldCheck, Eye, Trash2, X, Send, UserPlus, Clock } from 'lucide-react';

interface UsersTeamProps {
  companyId: string;
  currentUser: User;
}

const UsersTeam: React.FC<UsersTeamProps> = ({ companyId, currentUser }) => {
  const [users, setUsers] = useState<User[]>(dataStore.getCompanyUsers(companyId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'AGENT' as StaffRole
  });

  const canManage = currentUser.staffRole === 'ADMIN' || currentUser.role === 'BUSINESS';

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.email || !inviteData.name) return;

    const newUser = dataStore.addCompanyUser(companyId, {
      name: inviteData.name,
      email: inviteData.email,
      staffRole: inviteData.role
    });

    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setInviteData({ name: '', email: '', role: 'AGENT' });
    alert(`Convite enviado para ${inviteData.email}! (Simulação de envio de e-mail)`);
  };

  const RoleBadge = ({ role }: { role?: StaffRole }) => {
    const styles = {
      ADMIN: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      AGENT: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      VIEWER: 'bg-slate-50 text-slate-400 border-slate-100'
    };
    const labels = { ADMIN: 'Admin', AGENT: 'Agente', VIEWER: 'Leitura' };
    const Icon = role === 'ADMIN' ? ShieldCheck : role === 'AGENT' ? Shield : Eye;

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 w-fit ${styles[role || 'VIEWER']}`}>
        <Icon className="w-3 h-3" /> {labels[role || 'VIEWER']}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/5 text-primary rounded-[2rem]"><Users className="w-8 h-8" /></div>
            <div>
               <h2 className="text-2xl font-black text-slate-900">Gestão de Equipe</h2>
               <p className="text-slate-400 font-medium">Controle quem tem acesso ao Ativare Experience na sua empresa.</p>
            </div>
         </div>
         {canManage && (
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
           >
             <UserPlus className="w-5 h-5" /> Convidar Membro
           </button>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             {u.id === currentUser.id && (
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Você</div>
             )}
             
             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                   {u.profilePhoto ? (
                     <img src={u.profilePhoto} className="w-full h-full object-cover" alt="User" />
                   ) : (
                     <img src={`https://ui-avatars.com/api/?name=${u.name}&background=f8fafc&color=94a3b8`} className="w-full h-full" alt="Avatar" />
                   )}
                </div>
                <div>
                   <h4 className="text-base font-black text-slate-800 line-clamp-1">{u.name}</h4>
                   <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Nível de Acesso</span>
                   <RoleBadge role={u.staffRole} />
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Membro desde</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Mock'}
                   </span>
                </div>
             </div>

             {canManage && u.id !== currentUser.id && (
               <div className="mt-8 flex gap-2">
                  <button className="flex-1 py-2 bg-slate-50 text-slate-400 font-black text-[10px] uppercase rounded-xl hover:bg-slate-100 transition-all">Editar</button>
                  <button className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             )}
          </div>
        ))}
      </div>

      {/* Modal de Convite */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative z-10 shadow-2xl border border-white animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-6"><UserPlus className="w-10 h-10" /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Convidar para o Time</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">O membro receberá um e-mail com as instruções de acesso.</p>
            
            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Nome Completo</label>
                <input required type="text" value={inviteData.name} onChange={e => setInviteData({...inviteData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="Ex: João Silva" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">E-mail Corporativo</label>
                <input required type="email" value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="joao@empresa.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Nível de Acesso (Role)</label>
                <div className="grid grid-cols-3 gap-2">
                   {[
                     { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, desc: 'Acesso Total' },
                     { id: 'AGENT', label: 'Agente', icon: Shield, desc: 'Casos/Feedbacks' },
                     { id: 'VIEWER', label: 'Leitura', icon: Eye, desc: 'Apenas Relatórios' }
                   ].map(r => (
                     <button
                        key={r.id}
                        type="button"
                        onClick={() => setInviteData({...inviteData, role: r.id as StaffRole})}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${inviteData.role === r.id ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-100 text-slate-300'}`}
                     >
                        <r.icon className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase">{r.label}</span>
                     </button>
                   ))}
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                 Enviar Convite <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTeam;

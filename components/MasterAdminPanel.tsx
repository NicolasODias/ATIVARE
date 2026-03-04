
import React, { useState, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { Company, User, UserRole, PlanType, AccountStatus, AdminLog } from '../types';
import { 
  ShieldCheck, 
  Settings2, 
  Key, 
  Pause, 
  Play, 
  ArrowUpCircle, 
  Trash2, 
  UserPlus, 
  History, 
  Search,
  X,
  Lock,
  Mail,
  Store,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  Zap,
  Star,
  Users,
  Clock,
  Shield,
  Link,
  Unlink,
  FileText,
  UserMinus,
  Sparkles,
  HeartPulse
} from 'lucide-react';

const MasterAdminPanel: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [companies, setCompanies] = useState<Company[]>(dataStore.getAllCompanies());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComp, setSelectedComp] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'PASSWORD' | 'DETAILS' | 'PLAN' | 'COLLABORATOR' | 'LOGS' | 'STATUS'>('DETAILS');
  
  const [newPass, setNewPass] = useState('');
  const [editForm, setEditForm] = useState<Partial<Company>>({});
  const [collabForm, setCollabForm] = useState({ name: '', email: '' });

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cnpj?.includes(searchTerm) ||
      c.trackingCode.includes(searchTerm.toUpperCase())
    );
  }, [companies, searchTerm]);

  const handleAction = (action: () => void) => {
    action();
    setCompanies([...dataStore.getAllCompanies()]);
    setIsModalOpen(false);
  };

  const handleToggleGuardianConsultancy = (companyId: string) => {
    const updated = dataStore.adminToggleGuardianConsultancy(companyId, currentUser.name);
    if (updated) {
      setCompanies(dataStore.getAllCompanies());
      setSelectedComp(updated);
    }
  };

  const StatusBadge = ({ status }: { status: AccountStatus }) => {
    const styles = {
      ACTIVE: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      TRIAL: 'bg-blue-50 text-blue-600 border-blue-100',
      PAUSED: 'bg-amber-50 text-amber-600 border-amber-100',
      CANCELED: 'bg-red-50 text-red-600 border-red-100',
      SUSPENDED: 'bg-red-900 text-white border-red-950',
      EXPIRED: 'bg-slate-100 text-slate-400 border-slate-200'
    };
    return <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${styles[status]}`}>{status}</span>;
  };

  const PlanIcon = ({ plan }: { plan: PlanType }) => {
    if (plan === 'ENTERPRISE') return <Zap className="w-3 h-3 text-accent" />;
    if (plan === 'PRO') return <Star className="w-3 h-3 text-primary" />;
    return <Clock className="w-3 h-3 text-slate-300" />;
  };

  const openModal = (comp: Company, mode: typeof modalMode) => {
    setSelectedComp(comp);
    setModalMode(mode);
    setEditForm({ 
      name: comp.name, 
      email: comp.email, 
      cnpj: comp.cnpj,
      plan: comp.plan, 
      status: comp.status,
      isGuardianConsultancy: comp.isGuardianConsultancy
    });
    setCollabForm({ name: '', email: '' });
    setIsModalOpen(true);
  };

  const availableGuardians = useMemo(() => {
    if (!selectedComp) return [];
    return dataStore.getAllUsers().filter(u => 
      u.role === UserRole.GUARDIAN && 
      !u.linkedCompanyIds?.includes(selectedComp.id)
    );
  }, [selectedComp, companies]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 text-white rounded-[2rem] shadow-xl"><ShieldCheck className="w-8 h-8" /></div>
            <div>
               <h2 className="text-2xl font-black text-slate-900">Console ADM Global</h2>
               <p className="text-slate-400 font-medium">Controle total de infraestrutura e contas ADM_MASTER.</p>
            </div>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-80 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 flex items-center gap-3 focus-within:border-primary transition-all">
               <Search className="w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="ID, Nome, CNPJ ou E-mail..." 
                 className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-900" 
                 value={searchTerm} 
                 onChange={e => setSearchTerm(e.target.value)} 
               />
            </div>
            <button 
              onClick={() => { setModalMode('LOGS'); setIsModalOpen(true); }} 
              className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary hover:shadow-lg transition-all"
            >
              <History className="w-6 h-6" />
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">Estabelecimento</th>
              <th className="px-8 py-5">Plano & Código Público</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Tags</th>
              <th className="px-8 py-5 text-right">Controle Master</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCompanies.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-xs text-primary group-hover:scale-110 transition-transform">{c.name.charAt(0)}</div>
                      <div>
                         <p className="text-sm font-black text-slate-900 line-clamp-1">{c.name}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{c.email || 'Sem e-mail'} • {c.cnpj || 'Sem CNPJ'}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                     <PlanIcon plan={c.plan} />
                     <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Ativare {c.plan}</span>
                   </div>
                   <div className="mt-1 flex items-center gap-1">
                      <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 tracking-widest uppercase">Público: {c.trackingCode}</span>
                   </div>
                </td>
                <td className="px-8 py-5"><StatusBadge status={c.status} /></td>
                <td className="px-8 py-5">
                   {c.isGuardianConsultancy && (
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[8px] font-black uppercase tracking-tight">
                        <ShieldCheck className="w-2.5 h-2.5" /> Consultoria
                     </span>
                   )}
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(c, 'PASSWORD')} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100" title="Alterar Senha"><Key className="w-4 h-4" /></button>
                      <button onClick={() => openModal(c, 'DETAILS')} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm" title="Editar Dados"><Settings2 className="w-4 h-4" /></button>
                      <button onClick={() => openModal(c, 'COLLABORATOR')} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-500 transition-all" title="Gerenciar Equipe"><Users className="w-4 h-4" /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
              <div className="bg-slate-900 text-white p-8 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10">{modalMode === 'LOGS' ? <History className="w-6 h-6" /> : <Fingerprint className="w-6 h-6 text-accent" />}</div>
                    <div>
                       <h3 className="text-xl font-black">{modalMode === 'LOGS' ? 'Logs de Auditoria' : selectedComp?.name}</h3>
                       <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Acesso ADM_MASTER Sobrevivente</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                 {modalMode === 'PASSWORD' && (
                   <div className="space-y-6">
                      <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                         <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                         <p className="text-xs text-red-600 font-medium leading-relaxed">Atenção: Você está alterando a senha master deste negócio. O proprietário precisará usar a nova credencial imediatamente.</p>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Nova Senha</label>
                         <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-red-500 font-black text-slate-900" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Nova senha master..." />
                         </div>
                      </div>
                      <button onClick={() => handleAction(() => dataStore.adminResetPassword(dataStore.getCompanyUsers(selectedComp!.id).find(u => u.staffRole === 'ADMIN' || u.role === UserRole.BUSINESS)?.id || '', newPass, currentUser.name))} className="w-full py-5 bg-red-600 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl shadow-red-600/20">Confirmar Troca de Senha</button>
                   </div>
                 )}

                 {modalMode === 'DETAILS' && selectedComp && (
                   <div className="space-y-10">
                      {/* Sessão de Tag Consultoria Guardiã - NOVA */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2.5 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
                                  <ShieldCheck className="w-5 h-5" />
                               </div>
                               <div>
                                  <h4 className="text-base font-black text-indigo-900 uppercase tracking-tight">Consultoria Guardiã</h4>
                                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Acesso Global para Consultores</p>
                               </div>
                            </div>
                            <button 
                              onClick={() => handleToggleGuardianConsultancy(selectedComp.id)}
                              className={`w-14 h-7 rounded-full p-1 transition-all ${selectedComp.isGuardianConsultancy ? 'bg-indigo-500' : 'bg-slate-300'}`}
                            >
                               <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${selectedComp.isGuardianConsultancy ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                         </div>
                         <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                            Ao ativar esta tag, **TODOS** os usuários com perfil "Guardião" terão acesso automático a: Dashboard, Avaliações, Casos e Formulários deste cliente para fins de consultoria e análise.
                         </p>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Dados Mestres do Negócio</h4>
                         <div className="space-y-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome Comercial</label>
                               <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Nome" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail Administrativo</label>
                               <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="E-mail" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black uppercase text-slate-400 ml-2">CNPJ Oficial</label>
                               <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" value={editForm.cnpj} onChange={e => setEditForm({...editForm, cnpj: e.target.value})} placeholder="CNPJ" />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Status e Plano</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setEditForm({...editForm, plan: 'PRO'})} className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${editForm.plan === 'PRO' ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-100 text-slate-300'}`}><Star className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Plano PRO</span></button>
                            <button onClick={() => setEditForm({...editForm, plan: 'ENTERPRISE'})} className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${editForm.plan === 'ENTERPRISE' ? 'bg-accent/5 border-accent text-accent' : 'bg-white border-slate-100 text-slate-300'}`}><Zap className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Enterprise</span></button>
                         </div>
                         <div className="flex gap-2">
                            {['ACTIVE', 'PAUSED', 'CANCELED'].map((st) => (
                               <button key={st} onClick={() => setEditForm({...editForm, status: st as AccountStatus})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${editForm.status === st ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                  {st === 'PAUSED' ? 'Pausar Acesso' : st === 'ACTIVE' ? 'Reativar' : 'Cancelar Conta'}
                               </button>
                            ))}
                         </div>
                      </div>
                      <button onClick={() => handleAction(() => dataStore.adminUpdateCompany(selectedComp.id, editForm, currentUser.name))} className="w-full py-5 bg-primary text-white font-black rounded-[2rem] shadow-xl uppercase tracking-widest text-xs">Salvar Alterações Globais</button>
                   </div>
                 )}

                 {modalMode === 'COLLABORATOR' && selectedComp && (
                   <div className="space-y-12">
                      {/* Seção de Guardiões (Provisionamento e Vínculo) */}
                      <div className="space-y-6">
                         <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h4 className="text-[12px] font-black uppercase text-primary flex items-center gap-2">
                               <Shield className="w-4 h-4" /> Gestão de Guardiões
                            </h4>
                            <span className="text-[9px] font-black uppercase bg-primary/5 text-primary px-2 py-0.5 rounded">Multi-Unidades</span>
                         </div>

                         {/* Form para adicionar novo ou por e-mail */}
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Provisionar por Nome/E-mail</p>
                            <div className="flex flex-col gap-3">
                               <input 
                                 placeholder="Nome do Guardião" 
                                 className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm outline-none focus:border-primary" 
                                 value={collabForm.name} 
                                 onChange={e => setCollabForm({...collabForm, name: e.target.value})} 
                               />
                               <div className="flex gap-2">
                                  <input 
                                    placeholder="E-mail de Acesso" 
                                    className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm outline-none focus:border-primary" 
                                    value={collabForm.email} 
                                    onChange={e => setCollabForm({...collabForm, email: e.target.value})} 
                                  />
                                  <button 
                                    onClick={() => handleAction(() => dataStore.adminProvisionGuardian(collabForm.name, collabForm.email, selectedComp.id, currentUser.name))}
                                    disabled={!collabForm.name || !collabForm.email}
                                    className="px-6 bg-primary text-white font-black rounded-2xl shadow-lg disabled:opacity-30 uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                                  >
                                     Vincular
                                  </button>
                               </div>
                            </div>
                         </div>

                         {/* Guardiões JÁ VINCULADOS a esta conta */}
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardiões Vinculados a esta Conta</p>
                            {dataStore.getAllUsers().filter(u => u.role === UserRole.GUARDIAN && u.linkedCompanyIds?.includes(selectedComp.id)).map(g => (
                               <div key={g.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/20 shadow-sm animate-in fade-in">
                                  <div className="flex items-center gap-3">
                                     <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-md shadow-primary/20">{g.name.charAt(0)}</div>
                                     <div>
                                        <p className="text-xs font-black text-slate-800">{g.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{g.email}</p>
                                     </div>
                                  </div>
                                  <button 
                                    onClick={() => handleAction(() => dataStore.adminUnlinkGuardianFromCompany(g.id, selectedComp.id, currentUser.name))}
                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                                    title="Remover Vínculo"
                                  >
                                     <Unlink className="w-4 h-4" />
                                  </button>
                               </div>
                            ))}
                            {dataStore.getAllUsers().filter(u => u.role === UserRole.GUARDIAN && u.linkedCompanyIds?.includes(selectedComp.id)).length === 0 && (
                               <p className="text-center py-4 text-[10px] text-slate-300 font-bold uppercase border-2 border-dashed border-slate-50 rounded-2xl">Nenhum guardião vinculado.</p>
                            )}
                         </div>

                         {/* Guardiões EXISTENTES no sistema mas NÃO nesta conta */}
                         {availableGuardians.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardiões Ativos em outros Clientes</p>
                               <div className="grid grid-cols-1 gap-2">
                                  {availableGuardians.map(g => (
                                     <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-[10px] text-slate-400 shadow-sm">{g.name.charAt(0)}</div>
                                           <div className="text-xs font-bold text-slate-600">{g.name}</div>
                                        </div>
                                        <button 
                                          onClick={() => handleAction(() => dataStore.adminLinkGuardianToCompany(g.id, selectedComp.id, currentUser.name))}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary border border-primary/10 rounded-lg text-[9px] font-black uppercase tracking-tight hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                           <Link className="w-3 h-3" /> Vincular a este Cliente
                                        </button>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>

                      {/* Gestão de Colaboradores Internos do Cliente (Business/User) */}
                      <div className="space-y-6 pt-6 border-t border-slate-100">
                         <h4 className="text-[12px] font-black uppercase text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Membros Diretos do Estabelecimento
                         </h4>
                         <div className="space-y-3">
                            {dataStore.getCompanyUsers(selectedComp.id).map(u => (
                               <div key={u.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-400">{u.name.charAt(0)}</div>
                                     <div>
                                        <p className="text-xs font-black text-slate-800">{u.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{u.role} • {u.staffRole}</p>
                                     </div>
                                  </div>
                                  <div className="flex gap-1">
                                     <button 
                                       onClick={() => handleAction(() => dataStore.adminChangeUserRole(u.id, u.role === UserRole.ADM_MASTER ? UserRole.USER : UserRole.ADM_MASTER, currentUser.name))} 
                                       className={`p-2 rounded-xl transition-all ${u.role === UserRole.ADM_MASTER ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300'}`} 
                                       title="Conceder/Remover Master"
                                     >
                                        <ShieldCheck className="w-4 h-4" />
                                     </button>
                                     <button 
                                       onClick={() => handleAction(() => dataStore.adminRemoveCollaborator(u.id, currentUser.name))} 
                                       className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-all"
                                     >
                                        <UserMinus className="w-4 h-4" />
                                     </button>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {modalMode === 'LOGS' && (
                   <div className="space-y-6">
                      {dataStore.getAdminLogs().length === 0 ? <p className="text-center py-20 text-slate-300 text-xs font-black uppercase">Nenhum log registrado.</p> : dataStore.getAdminLogs().map(log => (
                          <div key={log.id} className="relative pl-8 border-l-2 border-slate-100">
                             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div></div>
                             <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-black text-primary uppercase tracking-widest">{log.performedBy}</span><span className="text-[9px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleString('pt-BR')}</span></div>
                             <p className="text-xs font-black text-slate-800 mb-1">{log.action}: <span className="text-slate-400">{log.targetName}</span></p>
                             <p className="text-[10px] text-slate-500 bg-slate-50 p-3 rounded-xl font-mono">{log.details}</p>
                          </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MasterAdminPanel;


import React, { useState, useMemo, useEffect } from 'react';
import { dataStore } from '../services/dataStore';
import { Lead, LeadStage, LeadTemperature, User } from '../types';
import { 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  History, 
  ListTodo, 
  Save, 
  Trash2, 
  CreditCard, 
  Zap, 
  Mail, 
  Phone, 
  Building, 
  ChevronRight,
  MoreVertical,
  Calendar,
  AlertCircle,
  Briefcase,
  FileText,
  UserPlus
} from 'lucide-react';

interface MasterLeadsProps {
  currentUser: User;
}

const LeadCard: React.FC<{ 
  lead: Lead; 
  onDragStart: (e: React.DragEvent, id: string) => void; 
  onClick: (lead: Lead) => void; 
}> = ({ lead, onDragStart, onClick }) => (
  <div 
    draggable
    onDragStart={(e) => onDragStart(e, lead.id)}
    onClick={() => onClick(lead)}
    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 group relative"
  >
    <div className="flex justify-between items-start mb-3">
      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tight ${
        lead.temperature === 'HOT' ? 'bg-red-50 text-red-500' :
        lead.temperature === 'WARM' ? 'bg-orange-50 text-orange-500' :
        'bg-slate-50 text-slate-400'
      }`}>
        {lead.temperature === 'NEW' ? 'Novo' : lead.temperature}
      </span>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-900">R$ {lead.monthlyValue.toLocaleString('pt-BR')}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase">MRR</p>
      </div>
    </div>
    
    <h4 className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{lead.companyName}</h4>
    <p className="text-[10px] text-slate-400 font-medium mb-4">{lead.name}</p>

    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
      <div className="flex gap-1">
         <span className="text-[8px] font-black uppercase tracking-tighter bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">{lead.source || 'Manual'}</span>
      </div>
      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase">
         <Calendar className="w-2.5 h-2.5" />
         {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
      </div>
    </div>
  </div>
);

const MasterLeads: React.FC<MasterLeadsProps> = ({ currentUser }) => {
  const [leads, setLeads] = useState<Lead[]>(dataStore.getLeads());
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'HISTORY' | 'TASKS'>('DETAILS');

  // Kanban Stages
  const stages: LeadStage[] = ['LEAD', 'CONTACTED', 'INTEREST', 'PROPOSAL', 'WON', 'LOST'];
  const stageLabels: Record<LeadStage, string> = {
    LEAD: 'Novos Leads',
    CONTACTED: 'Contatados',
    INTEREST: 'Interesse',
    PROPOSAL: 'Proposta',
    WON: 'Fechado (Ganho)',
    LOST: 'Perdido'
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      dataStore.updateLead(leadId, { stage: targetStage }, currentUser.name);
      setLeads([...dataStore.getLeads()]);
    }
  };

  const openDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveTab('DETAILS');
    setIsDrawerOpen(true);
  };

  const handleUpdateLead = (data: Partial<Lead>) => {
    if (selectedLead) {
      const updated = dataStore.updateLead(selectedLead.id, data, currentUser.name);
      if (updated) {
        setLeads([...dataStore.getLeads()]);
        setSelectedLead(updated);
      }
    }
  };

  const handleDeleteLead = () => {
    if (selectedLead && window.confirm('Excluir este lead permanentemente?')) {
      dataStore.deleteLead(selectedLead.id);
      setLeads([...dataStore.getLeads()]);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col space-y-6">
      {/* Header CRM */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Commercial Brain</h2>
            <p className="text-xs text-slate-400 font-medium">Gestão centralizada de oportunidades Inbound e Outbound.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 focus-within:border-primary transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar no funil..." 
              className="bg-transparent border-none outline-none text-xs w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => dataStore.addLead({ name: 'Novo Lead Manual', companyName: 'Empresa Exemplo', source: 'Manual' })}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Registro
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 min-w-[1500px] h-full">
          {stages.map(stage => (
            <div 
              key={stage} 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage)}
              className={`flex-1 flex flex-col rounded-3xl border p-3 transition-colors ${
                stage === 'WON' ? 'bg-emerald-50/30 border-emerald-100' : 
                stage === 'LOST' ? 'bg-red-50/30 border-red-100' : 'bg-slate-50/50 border-slate-100'
              }`}
            >
              <div className="flex justify-between items-center px-2 mb-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stageLabels[stage]}</h3>
                <span className="bg-white text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
                  {filteredLeads.filter(l => l.stage === stage).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredLeads.filter(l => l.stage === stage).map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onDragStart={handleDragStart} 
                    onClick={openDrawer} 
                  />
                ))}
              </div>

              {/* Column Value Indicator */}
              <div className="mt-3 p-3 bg-white/50 rounded-2xl border border-slate-100">
                 <p className="text-[8px] font-black uppercase text-slate-300">Potencial Mensal</p>
                 <p className="text-xs font-black text-slate-700">R$ {filteredLeads.filter(l => l.stage === stage).reduce((acc, l) => acc + l.monthlyValue, 0).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {isDrawerOpen && selectedLead && (
        <div className="fixed inset-0 z-[250] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">
                    {selectedLead.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{selectedLead.companyName}</h3>
                    <p className="text-sm font-bold text-slate-400">Origem: <span className="text-primary">{selectedLead.source}</span></p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <button onClick={handleDeleteLead} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                 <button onClick={() => setIsDrawerOpen(false)} className="p-3 text-slate-300 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex px-8 border-b border-slate-50">
              {['DETAILS', 'HISTORY', 'TASKS'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-slate-300'}`}
                >
                  {t === 'DETAILS' ? 'Dados Gerais' : t === 'HISTORY' ? 'Histórico' : 'Tarefas'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {activeTab === 'DETAILS' && (
                <div className="space-y-10 animate-in fade-in">
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] flex items-center gap-2"><Briefcase className="w-3 h-3" /> Informações do Lead</h4>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Responsável</label>
                          <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" value={selectedLead.name} onChange={e => handleUpdateLead({ name: e.target.value })} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Empresa</label>
                          <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" value={selectedLead.companyName} onChange={e => handleUpdateLead({ companyName: e.target.value })} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">WhatsApp</label>
                          <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" value={selectedLead.phone} onChange={e => handleUpdateLead({ phone: e.target.value })} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">E-mail</label>
                          <input className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" value={selectedLead.email} onChange={e => handleUpdateLead({ email: e.target.value })} />
                       </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2 border-b border-primary/10 pb-2"><DollarSign className="w-3 h-3" /> Condições Comerciais</h4>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">MRR (Mensal)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">R$</span>
                            <input type="number" className="w-full pl-8 p-3 bg-primary/5 border border-primary/10 rounded-xl font-black text-sm text-primary" value={selectedLead.monthlyValue} onChange={e => handleUpdateLead({ monthlyValue: Number(e.target.value) })} />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Setup (Unidade)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">R$</span>
                            <input type="number" className="w-full pl-8 p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" value={selectedLead.implementationValue} onChange={e => handleUpdateLead({ implementationValue: Number(e.target.value) })} />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Assessoria</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">R$</span>
                            <input type="number" className="w-full pl-8 p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" value={selectedLead.consultingValue} onChange={e => handleUpdateLead({ consultingValue: Number(e.target.value) })} />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Plano Proposto</label>
                          <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm appearance-none" value={selectedLead.forecast || 'PRO'} onChange={e => handleUpdateLead({ forecast: e.target.value })}>
                             <option value="PRO">Plano Profissional</option>
                             <option value="ENTERPRISE">Enterprise</option>
                             <option value="CUSTOM">Customizado / Redes</option>
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Status Contrato</label>
                          <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm appearance-none" value={selectedLead.contractStatus} onChange={e => handleUpdateLead({ contractStatus: e.target.value as any })}>
                             <option value="NONE">Sem contrato</option>
                             <option value="PENDING">Em assinatura</option>
                             <option value="SIGNED">Assinado</option>
                          </select>
                       </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-3xl text-white flex justify-between items-center shadow-xl">
                       <div>
                          <p className="text-[9px] font-black uppercase text-white/40 mb-1">Valor Total de Fechamento (LTV 12m)</p>
                          <p className="text-2xl font-black">R$ {(selectedLead.monthlyValue * 12 + selectedLead.implementationValue + selectedLead.consultingValue).toLocaleString('pt-BR')}</p>
                       </div>
                       <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                       </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'HISTORY' && (
                <div className="space-y-6 animate-in fade-in">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Atividades e Notas</p>
                      {selectedLead.history.map(h => (
                        <div key={h.id} className="relative pl-8 border-l-2 border-slate-100 pb-8 last:pb-0">
                           <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-primary rounded-full"></div>
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-black text-primary uppercase">{h.userName}</span>
                              <span className="text-[9px] font-bold text-slate-400">{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                           </div>
                           <p className="text-sm font-medium text-slate-600 leading-relaxed">{h.text}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-3">
               <button 
                onClick={() => { handleUpdateLead({ stage: 'WON' }); setIsDrawerOpen(false); }}
                className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
               >
                 <CheckCircle2 className="w-4 h-4" /> Ganhou Negócio
               </button>
               <button 
                onClick={() => { handleUpdateLead({ stage: 'LOST' }); setIsDrawerOpen(false); }}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest text-[10px]"
               >
                 Perdeu
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterLeads;

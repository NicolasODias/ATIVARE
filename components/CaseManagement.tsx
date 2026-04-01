
import React, { useState, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { Case, CaseStatus, Feedback, User, Customer } from '../types';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MoreVertical, 
  User as UserIcon,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface CaseManagementProps {
  companyId: string;
  currentUser: User;
}

const CaseManagement: React.FC<CaseManagementProps> = ({ companyId, currentUser }) => {
  const [filter, setFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const cases = dataStore.getCases(companyId);
  const feedbacks = dataStore.getFeedbacks(companyId);
  
  const filteredCases = filter === 'ALL' ? cases : cases.filter(c => c.status === filter);

  const getFeedbackForCase = (feedbackId: string) => feedbacks.find(f => f.id === feedbackId);

  const handleResolve = () => {
    if (selectedCase && resolutionText.trim()) {
      dataStore.resolveCase(selectedCase.id, resolutionText, currentUser.name, currentUser.id);
      setSelectedCase(null);
      setResolutionText('');
    }
  };

  const StatusBadge = ({ status }: { status: CaseStatus }) => {
    const styles = {
      OPEN: 'bg-red-50 text-red-600 border-red-100',
      IN_PROGRESS: 'bg-amber-50 text-amber-600 border-amber-100',
      RESOLVED: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    const labels = {
      OPEN: 'Aberto',
      IN_PROGRESS: 'Em Atendimento',
      RESOLVED: 'Resolvido'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cases List */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-800">Fila de Atendimento</h3>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['ALL', 'OPEN', 'RESOLVED'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s as any)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filter === s ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s === 'ALL' ? 'Todos' : s === 'OPEN' ? 'Abertos' : 'Resolvidos'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCases.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">Nenhum caso encontrado para este filtro.</div>
            ) : (
              filteredCases.map(c => {
                const fb = getFeedbackForCase(c.feedbackId);
                return (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCase(c)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-primary/50 hover:shadow-md ${
                      selectedCase?.id === c.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">
                          {fb?.customerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{fb?.customerName}</p>
                          <p className="text-xs text-slate-400 font-medium">{fb?.customerPhone}</p>
                        </div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mt-4 text-sm text-slate-600 line-clamp-2 italic">"{fb?.observation}"</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>Há {Math.floor(Math.random() * 5) + 1} horas</span>
                      </div>
                      <button className="text-primary font-bold text-xs flex items-center space-x-1">
                        <span>Ver Detalhes</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Detail View / Resolution */}
      <div className="lg:col-span-1">
        {selectedCase ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl sticky top-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-slate-800">Detalhes do Caso</h3>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Avaliação Origem</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">Média:</span>
                  <span className="text-sm font-black text-red-500">{(getFeedbackForCase(selectedCase.feedbackId)?.averageScore || 0).toFixed(1)} / 10</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(getFeedbackForCase(selectedCase.feedbackId)?.scores || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[10px] uppercase font-bold text-slate-500 bg-white p-1.5 rounded-lg border border-slate-100">
                      <span>{key}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Feedback do Cliente</p>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 italic text-sm text-slate-700">
                  "{getFeedbackForCase(selectedCase.feedbackId)?.observation}"
                </div>
              </div>

              {selectedCase.status === 'RESOLVED' ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolução
                    </p>
                    <p className="text-sm text-slate-700">{selectedCase.resolutionText}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Ação Tomada (Obrigatório)</label>
                    <textarea
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Descreva como resolveu este problema..."
                      className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900"
                    ></textarea>
                  </div>
                  <button 
                    onClick={handleResolve}
                    disabled={!resolutionText.trim()}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-[#003680] shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Marcar como Resolvido
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-500">Selecione um caso ao lado para visualizar os detalhes e tomar uma ação.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseManagement;

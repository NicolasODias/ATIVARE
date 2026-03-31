
import React, { useState, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { Feedback, NPSCategory, User, Case, InternalQuestion } from '../types';
import { 
  Search, 
  ChevronRight, 
  Share2, 
  Star, 
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  X,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  QrCode,
  ShieldCheck
} from 'lucide-react';

interface FeedbacksProps {
  companyId: string;
  currentUser: User;
}

const Feedbacks: React.FC<FeedbacksProps> = ({ companyId, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NPSCategory | 'ALL'>('ALL');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [internalNote, setInternalNote] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  const feedbacks = useMemo(() => dataStore.getFeedbacks(companyId), [companyId, selectedFeedback]);
  const company = useMemo(() => dataStore.getCompany(companyId), [companyId]);
  
  // Perguntas internas para staff (não públicas)
  const staffQuestions = useMemo(() => 
    dataStore.getInternalQuestions(companyId, false).filter(q => !q.isPublic && q.active), 
  [companyId]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter(f => {
        const matchesSearch = f.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [feedbacks, searchTerm, categoryFilter]);

  const currentCase = selectedFeedback ? dataStore.getCaseForFeedback(selectedFeedback.id) : null;

  const getEvaluationLink = () => {
    if (!company) return '';
    return `${window.location.origin}/avaliar/${company.trackingCode}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getEvaluationLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCase = () => {
    if (selectedFeedback) {
      dataStore.createCaseFromFeedback(selectedFeedback.id, companyId, internalNote, currentUser.name, currentUser.id);
      setInternalNote('');
      setSelectedFeedback({...selectedFeedback});
    }
  };

  const handleAddNote = () => {
    if (currentCase && internalNote.trim()) {
      dataStore.addCaseNote(currentCase.id, currentUser.id, currentUser.name, internalNote);
      setInternalNote('');
      setSelectedFeedback({...selectedFeedback!});
    }
  };

  const handleResolve = () => {
    if (currentCase && resolutionText.trim()) {
      dataStore.resolveCase(currentCase.id, resolutionText, currentUser.name, currentUser.id);
      setResolutionText('');
      setSelectedFeedback({...selectedFeedback!});
    }
  };

  const handleStaffResponse = (qId: string, value: any) => {
    if (selectedFeedback) {
      const updated = dataStore.updateFeedbackInternalResponses(selectedFeedback.id, { [qId]: value });
      if (updated) setSelectedFeedback({ ...updated });
    }
  };

  const CategoryTag = ({ category }: { category: NPSCategory }) => {
    const styles = {
      PROMOTER: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      PASSIVE: 'bg-amber-50 text-amber-600 border-amber-100',
      DETRACTOR: 'bg-red-50 text-red-600 border-red-100'
    };
    const labels = { PROMOTER: 'Promotor', PASSIVE: 'Passivo', DETRACTOR: 'Detrator' };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[category]}`}>
        {labels[category]}
      </span>
    );
  };

  const RatingDotsView = ({ label, value, max = 10, onChange }: any) => {
    const getColorClass = (val: number) => {
      if (val === 0) return 'bg-slate-100';
      if (val <= (max * 0.3)) return 'bg-red-500';
      if (val <= (max * 0.6)) return 'bg-yellow-400';
      return 'bg-emerald-500';
    };
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
          <span>{label}</span>
          <span className={`font-black ${value === 0 ? 'text-slate-300' : value <= (max * 0.3) ? 'text-red-500' : value <= (max * 0.6) ? 'text-yellow-600' : 'text-emerald-500'}`}>{value || '—'}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <button 
              key={i} 
              disabled={!onChange}
              onClick={() => onChange && onChange(i + 1)}
              className={`flex-1 h-2.5 rounded-full transition-all ${
                i + 1 <= value ? getColorClass(value) : 'bg-slate-100'
              } ${onChange ? 'hover:scale-110 cursor-pointer' : ''}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-1 w-full md:max-w-md bg-white rounded-2xl border border-slate-200 px-4 py-2.5 items-center space-x-3 shadow-sm focus-within:border-primary transition-all">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome do cliente..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select 
            className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-primary shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
          >
            <option value="ALL">Todas Categorias</option>
            <option value="PROMOTER">Promotores</option>
            <option value="PASSIVE">Passivos</option>
            <option value="DETRACTOR">Detratores</option>
          </select>

          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 bg-accent hover:bg-[#e65d00] text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-accent/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Gerar Link</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Data</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Score Médio</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">NPS</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">Nenhuma avaliação encontrada.</td>
                </tr>
              ) : (
                filteredFeedbacks.map((f) => (
                  <tr 
                    key={f.id} 
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedFeedback(f)}
                  >
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-slate-500">
                      {new Date(f.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400">
                          {f.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{f.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{f.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-10 rounded-xl font-black text-sm border ${
                        f.averageScore >= 9 ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 
                        f.averageScore <= 6 ? 'border-red-200 bg-red-50 text-red-600' : 'border-amber-200 bg-amber-50 text-amber-600'
                      }`}>
                        {f.averageScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <CategoryTag category={f.category} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-300 group-hover:text-primary transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedFeedback && (
        <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedFeedback(null)}></div>
          
          <div className="relative w-full max-width max-w-2xl bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="bg-white px-8 py-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
                  {selectedFeedback.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{selectedFeedback.customerName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryTag category={selectedFeedback.category} />
                    <span className="text-xs font-bold text-slate-400">• Avaliado em {new Date(selectedFeedback.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Perfil do Cliente
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg"><Phone className="w-4 h-4 text-slate-500" /></div>
                      <span className="text-sm font-bold text-slate-700">{selectedFeedback.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg"><Mail className="w-4 h-4 text-slate-500" /></div>
                      <span className="text-sm font-bold text-slate-700">{selectedFeedback.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="w-4 h-4 text-slate-500" /></div>
                      <span className="text-sm font-bold text-slate-700 uppercase text-[10px] tracking-tight">{selectedFeedback.profile}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-center items-center text-center">
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-2 ${
                    selectedFeedback.averageScore >= 9 ? 'border-emerald-500 text-emerald-600' : 
                    selectedFeedback.averageScore <= 6 ? 'border-red-500 text-red-600' : 'border-amber-500 text-amber-600'
                  }`}>
                    <span className="text-3xl font-black">{selectedFeedback.averageScore.toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Score de Experiência</p>
                </div>
              </div>

              {/* Seção de Métricas Internas (Staff) */}
              <div className="bg-indigo-50/30 p-8 rounded-[2.5rem] border border-indigo-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Métricas Internas de Staff
                  </h4>
                  <span className="text-[8px] font-black uppercase bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded">Visível apenas para equipe</span>
                </div>

                <div className="space-y-8">
                   {staffQuestions.length === 0 ? (
                     <p className="text-center text-[10px] font-bold text-slate-400 uppercase py-4">Nenhuma métrica interna configurada.</p>
                   ) : (
                     staffQuestions.map(q => (
                       <div key={q.id}>
                         {q.type === 'YES_NO' ? (
                            <div className="space-y-3">
                              <label className="text-[11px] font-bold text-slate-700 uppercase">{q.text}</label>
                              <div className="flex gap-2">
                                {['SIM', 'NÃO'].map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => handleStaffResponse(q.id, opt)}
                                    className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all border-2 ${
                                      selectedFeedback.internalResponses?.[q.id] === opt 
                                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' 
                                        : 'bg-white border-slate-100 text-slate-400'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                         ) : q.type === 'TEXT' ? (
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-slate-700 uppercase">{q.text}</label>
                              <textarea 
                                value={selectedFeedback.internalResponses?.[q.id] || ''}
                                onChange={(e) => handleStaffResponse(q.id, e.target.value)}
                                className="w-full h-20 p-4 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:border-indigo-500 font-medium text-slate-900"
                                placeholder="Observação interna..."
                              />
                            </div>
                         ) : (
                           <RatingDotsView 
                             label={q.text} 
                             max={q.type === 'SCALE_5' ? 5 : 10}
                             value={selectedFeedback.internalResponses?.[q.id] || 0}
                             onChange={(v: number) => handleStaffResponse(q.id, v)}
                           />
                         )}
                       </div>
                     ))
                   )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Star className="w-3 h-3" /> Notas do Cliente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RatingDotsView label="Atendimento" value={selectedFeedback.scores.service} />
                  <RatingDotsView label="Comida" value={selectedFeedback.scores.food} />
                  <RatingDotsView label="Bebidas" value={selectedFeedback.scores.drinks} />
                  <RatingDotsView label="Ambiente" value={selectedFeedback.scores.structure} />
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Observação do Cliente:</p>
                  <p className="text-sm text-slate-700 italic bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                    "{selectedFeedback.observation || 'O cliente não deixou comentários adicionais.'}"
                  </p>
                </div>
              </div>

              <div className="bg-[#002e6b] rounded-3xl p-8 shadow-xl shadow-[#002e6b]/20 text-white space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    Painel de Resolução
                  </h4>
                  {currentCase && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      currentCase.status === 'RESOLVED' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-accent/20 border-accent text-accent'
                    }`}>
                      {currentCase.status === 'RESOLVED' ? 'Resolvido' : 'Caso em Aberto'}
                    </span>
                  )}
                </div>

                {!currentCase ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300">Esta avaliação ainda não possui um caso aberto. Deseja iniciar um protocolo de atendimento para este cliente?</p>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Observação Inicial</label>
                      <textarea 
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        placeholder="Ex: Entrar em contato via WhatsApp para entender melhor o ocorrido..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-accent transition-all h-24 placeholder:text-slate-500"
                      />
                    </div>
                    <button 
                      onClick={handleCreateCase}
                      className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Abrir Caso de Gestão
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Timeline do Atendimento
                      </p>
                      <div className="space-y-3">
                        {currentCase.notes.map(note => (
                          <div key={note.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-accent">{note.userName}</span>
                              <span className="text-[9px] text-slate-400">{new Date(note.createdAt).toLocaleString('pt-BR')}</span>
                            </div>
                            <p className="text-xs text-slate-200">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentCase.status !== 'RESOLVED' && (
                      <div className="space-y-6 pt-6 border-t border-white/10">
                        <div className="space-y-4">
                          <textarea 
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                            placeholder="Adicionar nova observação interna..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-accent transition-all h-20 placeholder:text-slate-500"
                          />
                          <button 
                            onClick={handleAddNote}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all text-xs"
                          >
                            Adicionar Nota Interna
                          </button>
                        </div>

                        <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                          <h5 className="text-sm font-black flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Finalizar Atendimento
                          </h5>
                          <textarea 
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            placeholder="Descreva a solução final dada ao cliente (obrigatório para resolver)..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-emerald-400 transition-all h-24 placeholder:text-slate-500"
                          />
                          <button 
                            disabled={!resolutionText.trim()}
                            onClick={handleResolve}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            Resolver e Encerrar Caso
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative z-10 shadow-2xl border border-white animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-900 mb-2">Divulgue sua Experiência</h3>
            <p className="text-center text-slate-500 text-sm font-medium mb-8">Seu código de rastreamento exclusivo é <span className="text-primary font-black">{company?.trackingCode}</span></p>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <code className="text-[10px] font-bold text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                  {getEvaluationLink()}
                </code>
                <button 
                  onClick={handleCopyLink}
                  className={`p-2 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-primary shadow-sm'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4">Acesso via Código Público</p>
                <div className="text-3xl font-black tracking-[0.2em] text-primary">{company?.trackingCode}</div>
              </div>

              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;


import React, { useState, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { Customer, Feedback, NPSCategory, User, ContactLogType } from '../types';
import { 
  Search, 
  ChevronRight, 
  User as UserIcon, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Clock,
  Plus,
  X,
  Smartphone,
  History
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomersProps {
  companyId: string;
  currentUser: User;
}

const Customers: React.FC<CustomersProps> = ({ companyId, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'ALL' | 'DETRACTOR' | 'PASSIVE' | 'PROMOTER'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [logText, setLogText] = useState('');
  const [logType, setLogType] = useState<ContactLogType>('INTERNAL_NOTE');

  const customers = useMemo(() => dataStore.getCustomers(companyId), [companyId, selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
      const matchesScore = scoreFilter === 'ALL' || c.category === scoreFilter;
      return matchesSearch && matchesScore;
    }).sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
  }, [customers, searchTerm, scoreFilter]);

  const customerHistory = useMemo(() => {
    // Retorna ordenado por data descendente para a lista de histórico
    return selectedCustomer ? [...dataStore.getCustomerHistory(selectedCustomer.id)].reverse() : [];
  }, [selectedCustomer]);

  const chartData = useMemo(() => {
    // Retorna ordenado por data ascendente para o gráfico (ponto a ponto)
    return selectedCustomer ? dataStore.getCustomerHistory(selectedCustomer.id).map((f, index) => ({
      id: f.id,
      index: index + 1,
      date: new Date(f.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      score: Number(f.averageScore.toFixed(1)),
      fullDate: new Date(f.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      observation: f.observation
    })) : [];
  }, [selectedCustomer]);

  const handleAddLog = () => {
    if (selectedCustomer && logText.trim()) {
      dataStore.addContactLog(selectedCustomer.id, {
        type: logType,
        text: logText,
        userId: currentUser.id,
        userName: currentUser.name
      });
      setLogText('');
      setSelectedCustomer({...selectedCustomer});
    }
  };

  const CategoryBadge = ({ category }: { category: NPSCategory }) => {
    const styles = {
      PROMOTER: 'bg-emerald-100 text-emerald-700',
      PASSIVE: 'bg-amber-100 text-amber-700',
      DETRACTOR: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${styles[category]}`}>
        {category}
      </span>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200 max-w-[200px]">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{data.fullDate}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-black text-primary">{data.score}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pontos</span>
          </div>
          {data.observation && (
            <p className="text-[10px] text-slate-500 font-medium italic border-t border-slate-50 pt-2 line-clamp-2">"{data.observation}"</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full md:max-w-md bg-white border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 focus-within:border-primary shadow-sm transition-all">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'PROMOTER', 'PASSIVE', 'DETRACTOR'].map(f => (
            <button
              key={f}
              onClick={() => setScoreFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scoreFilter === f ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(c => (
          <div 
            key={c.id} 
            onClick={() => setSelectedCustomer(c)}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                {c.name.charAt(0)}
              </div>
              <CategoryBadge category={c.category} />
            </div>
            
            <h4 className="text-lg font-black text-slate-900 mb-1">{c.name}</h4>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-4">
              <Phone className="w-3 h-3" />
              <span>{c.phone}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Médio</p>
                <p className="text-xl font-black text-slate-800">{c.averageScore.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Visitas</p>
                <p className="text-xl font-black text-slate-800">{c.totalFeedbacks}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase">Última visita: {new Date(c.lastSeen).toLocaleDateString('pt-BR')}</span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}></div>
          <div className="relative w-full max-w-4xl bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            
            <div className="bg-white p-8 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-primary text-white flex items-center justify-center text-3xl font-black">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm font-bold text-slate-400"><Smartphone className="w-4 h-4" /> {selectedCustomer.phone}</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-slate-400"><Calendar className="w-4 h-4" /> Cliente desde {new Date(selectedCustomer.firstSeen).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Satisfação</p>
                    <p className={`text-3xl font-black ${selectedCustomer.category === 'PROMOTER' ? 'text-emerald-500' : selectedCustomer.category === 'DETRACTOR' ? 'text-red-500' : 'text-amber-500'}`}>{selectedCustomer.averageScore.toFixed(1)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Visitas</p>
                    <p className="text-3xl font-black text-slate-800">{selectedCustomer.totalFeedbacks}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Status NPS</p>
                    <CategoryBadge category={selectedCustomer.category} />
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                  <h3 className="text-sm font-black uppercase text-slate-400 mb-8 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Evolução de Humor</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                        />
                        <YAxis domain={[0, 10]} axisLine={false} tickLine={false} hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#0047a7" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#0047a7', strokeWidth: 2, stroke: '#fff' }} 
                          activeDot={{ r: 8, strokeWidth: 0, fill: '#ff6800' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-400 flex items-center gap-2"><History className="w-4 h-4" /> Histórico de Feedbacks</h3>
                  <div className="space-y-3">
                    {customerHistory.map(f => (
                      <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                            f.category === 'PROMOTER' ? 'bg-emerald-50 text-emerald-600' : f.category === 'DETRACTOR' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {f.averageScore.toFixed(1)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{new Date(f.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            <p className="text-xs text-slate-400 truncate max-w-xs">"{f.observation || 'Sem comentários'}"</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    ))}
                    {customerHistory.length === 0 && <p className="text-center py-10 text-slate-400 font-medium">Nenhum feedback registrado.</p>}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-black uppercase text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Log de Atendimento</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {(['INTERNAL_NOTE', 'WHATSAPP', 'CALL', 'EMAIL'] as ContactLogType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setLogType(type)}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                            logType === type ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {type.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={logText}
                      onChange={(e) => setLogText(e.target.value)}
                      placeholder="Registrar nova interação..."
                      className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary transition-all resize-none text-slate-900"
                    />
                    <button 
                      onClick={handleAddLog}
                      className="w-full py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" /> Registrar Log
                    </button>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    {selectedCustomer.contactLogs.map(log => (
                      <div key={log.id} className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                          <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'VISIT' ? 'bg-blue-500' : 'bg-accent'}`}></div>
                        </div>
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-primary tracking-widest">{log.type.replace('_', ' ')}</span>
                          <span className="text-[9px] font-bold text-slate-400">{new Date(log.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{log.text}</p>
                        <p className="mt-1 text-[9px] font-bold text-slate-300 uppercase">Registrado por: {log.userName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

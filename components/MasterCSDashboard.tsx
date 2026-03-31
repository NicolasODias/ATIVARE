
import React, { useState, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { 
  Smile, 
  Meh, 
  Frown, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  Target, 
  Users, 
  ChevronRight, 
  X,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  PieChart,
  BrainCircuit,
  Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const MasterCSDashboard: React.FC = () => {
  const stats = dataStore.getMasterCSStats();
  const [selectedComp, setSelectedComp] = useState<any | null>(null);

  const npsClassification = (nps: number) => {
    if (nps >= 80) return { label: 'Excelente', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (nps >= 60) return { label: 'Muito Bom', color: 'text-primary', bg: 'bg-primary/5' };
    return { label: 'Zona de Atenção', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const distributionData = [
    { name: 'Promotores', value: stats.distribution.promoters },
    { name: 'Neutros', value: stats.distribution.passives },
    { name: 'Detratores', value: stats.distribution.detractors },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Platform Health Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="relative z-10 space-y-6 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-widest">
                 <Activity className="w-3 h-3" /> Saúde Global da Plataforma
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Seu NPS Global está em <br/><span className={npsClassification(stats.globalScore).color}>{stats.globalScore} pontos.</span>
              </h2>
              <p className="text-slate-400 font-medium max-w-sm">Média calculada sobre {stats.totalEvaluations} avaliações reais recebidas por {stats.ranking.length} empresas.</p>
              
              <div className="flex gap-4 pt-2">
                 <div className={`${npsClassification(stats.globalScore).bg} ${npsClassification(stats.globalScore).color} px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest`}>
                    Status: {npsClassification(stats.globalScore).label}
                 </div>
              </div>
           </div>
           
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={502.4} 
                    strokeDashoffset={502.4 - (502.4 * stats.globalScore) / 100} 
                    className={`${npsClassification(stats.globalScore).color} transition-all duration-1000 ease-out`} 
                    strokeLinecap="round" 
                 />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                 <span className="text-5xl font-black text-slate-900">{stats.globalScore}</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400">Score Médio</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 flex flex-col justify-between">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <BrainCircuit className="w-6 h-6 text-accent" />
                 <h3 className="text-xl font-black">CS Insights (IA)</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                {stats.totalEvaluations > 0 
                  ? "Analisando padrões de comportamento e feedback para gerar insights estratégicos."
                  : "Aguardando dados suficientes para gerar insights automáticos via IA."}
              </p>
           </div>
           
           <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3">Principais Atritos</p>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold"><span className="text-white/70">Nenhum atrito detectado</span><span>0%</span></div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-accent w-0"></div></div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* NPS Ranking Table */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Ranking NPS de Empresas</h3>
                 <p className="text-slate-400 font-medium text-sm">Performance individual por cliente.</p>
              </div>
           </div>

           <div className="overflow-hidden border border-slate-50 rounded-2xl">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       <th className="px-6 py-4">Empresa</th>
                       <th className="px-6 py-4">Segmento</th>
                       <th className="px-6 py-4 text-center">NPS</th>
                       <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {stats.ranking.map((row, idx) => (
                       <tr 
                        key={idx} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedComp(row)}
                       >
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400">{row.name.charAt(0)}</div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{row.name}</p>
                                   <p className="text-[10px] text-slate-400">{row.city}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase">{row.segment}</td>
                          <td className="px-6 py-4 text-center">
                             <span className={`text-sm font-black ${row.nps >= 80 ? 'text-emerald-500' : row.nps <= 60 ? 'text-red-500' : 'text-amber-500'}`}>{row.nps}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               row.status === 'PROMOTER' ? 'bg-emerald-50 text-emerald-600' :
                               row.status === 'DETRACTOR' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                             }`}>{row.status}</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Side Panels: Dist & Segment */}
        <div className="lg:col-span-4 space-y-8">
           {/* Distribuição */}
           <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-black text-slate-900">Distribuição NPS</h3>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                       <Tooltip cursor={{fill: 'transparent'}} />
                       <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                          {distributionData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </section>

           {/* Empresas em Risco */}
           <section className="bg-red-50 p-8 rounded-[3rem] border border-red-100 space-y-6">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="w-5 h-5 text-red-500" />
                 <h3 className="text-lg font-black text-red-900">Alerta de Risco</h3>
              </div>
              <div className="space-y-3">
                 {stats.atRisk.map(comp => (
                    <div key={comp.id} className="bg-white p-4 rounded-2xl border border-red-200 flex justify-between items-center group">
                       <div>
                          <p className="text-xs font-black text-slate-800">{comp.name}</p>
                          <p className="text-[10px] text-red-500 font-bold uppercase">{comp.nps} pts • Crítico</p>
                       </div>
                       <button className="p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                          <MessageSquare className="w-4 h-4" />
                       </button>
                    </div>
                 ))}
                 {stats.atRisk.length === 0 && <p className="text-xs text-slate-400 font-medium">Nenhuma empresa em risco crítico.</p>}
              </div>
           </section>

           {/* Segment Comparison */}
           <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">NPS por Segmento</h3>
              <div className="space-y-4">
                 {stats.segmentAverages.map(seg => (
                    <div key={seg.name} className="flex justify-between items-center py-2 border-b border-slate-50">
                       <span className="text-sm font-bold text-slate-600">{seg.name}</span>
                       <span className="text-sm font-black text-slate-900">{seg.average} pts</span>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>

      {/* Drill-down Modal (Company Detail) */}
      {selectedComp && (
        <div className="fixed inset-0 z-[200] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedComp(null)}></div>
           <div className="relative w-full max-w-2xl bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
              <div className="bg-white p-8 border-b border-slate-200 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-black">{selectedComp.name.charAt(0)}</div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900">{selectedComp.name}</h3>
                       <p className="text-sm font-bold text-slate-400 uppercase">{selectedComp.segment} • {selectedComp.city}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedComp(null)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Score NPS</p>
                       <p className={`text-4xl font-black ${selectedComp.nps >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>{selectedComp.nps}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Classificação</p>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          selectedComp.status === 'PROMOTER' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                       }`}>{selectedComp.status}</span>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
                    <h4 className="text-sm font-black uppercase text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Histórico de Tendência</h4>
                    <div className="h-[200px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { month: 'Jan', score: selectedComp.nps - 5 },
                            { month: 'Fev', score: selectedComp.nps - 2 },
                            { month: 'Mar', score: selectedComp.nps },
                          ]}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                             <YAxis hide domain={[0, 100]} />
                             <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                             <Area type="monotone" dataKey="score" stroke="#0047a7" fill="#0047a710" strokeWidth={4} />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase text-slate-400 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Comentários Recentes da Empresa</h4>
                    <div className="space-y-3">
                       {dataStore.getFeedbacks(selectedComp.id).slice(0, 5).map(f => (
                          <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400">{new Date(f.createdAt).toLocaleDateString('pt-BR')}</span>
                                <span className={`text-[10px] font-black ${f.category === 'PROMOTER' ? 'text-emerald-500' : 'text-red-500'}`}>{f.averageScore} pts</span>
                             </div>
                             <p className="text-sm text-slate-600 font-medium italic">"{f.observation || 'Sem comentário.'}"</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-200 bg-white flex gap-3">
                 <button className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-[10px]">Iniciar Contato Consultivo</button>
                 <button className="px-6 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]">Ver BI Completo</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MasterCSDashboard;

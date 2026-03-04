
import React, { useState, useEffect, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { 
  TrendingUp, 
  Users, 
  RefreshCcw, 
  Calendar, 
  ChevronRight, 
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  ArrowUpRight,
  Target,
  Sparkles,
  Phone,
  User as UserIcon,
  Cake,
  Clock,
  Zap,
  CheckCircle2,
  Filter,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie,
  Legend
} from 'recharts';

interface GrowthProps {
  companyId: string;
}

const Growth: React.FC<GrowthProps> = ({ companyId }) => {
  const [days, setDays] = useState(90);
  const [riskDays, setRiskDays] = useState(60);
  const [activeOnly, setActiveOnly] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await dataStore.getGrowthMetrics(companyId, { days, riskDays });
      const riskList = await dataStore.listAtRiskCustomers(companyId, riskDays);
      setMetrics(data);
      setAtRisk(riskList);
      setLoading(false);
    };
    loadData();
  }, [companyId, days, riskDays]);

  const segmentationData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Únicos (1)', value: metrics.segmentation.uniques, color: '#94a3b8' },
      { name: 'Recorrentes (2-4)', value: metrics.segmentation.recurrents, color: '#0047a7' },
      { name: 'Fiéis (5+)', value: metrics.segmentation.loyal, color: '#ff6800' }
    ];
  }, [metrics]);

  const npsCorrelationData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Promotores', value: Number(metrics.npsCorrelation.promoter.toFixed(1)), color: '#10b981' },
      { name: 'Passivos', value: Number(metrics.npsCorrelation.passive.toFixed(1)), color: '#f59e0b' },
      { name: 'Detratores', value: Number(metrics.npsCorrelation.detractor.toFixed(1)), color: '#ef4444' }
    ];
  }, [metrics]);

  const ageData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics.ageRanges).map(([key, val]: any) => ({
      name: key,
      count: val.count,
      avgVisits: val.count > 0 ? val.visits / val.count : 0
    })).filter(d => d.name !== "Não informado" || d.count > 0);
  }, [metrics]);

  if (loading || !metrics) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Processando dados comportamentais...</p>
      </div>
    );
  }

  const MetricCard = ({ title, value, subValue, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-black text-slate-900">{value}</h4>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{subValue}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-6 items-center">
         <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-transparent text-xs font-black text-slate-700 outline-none uppercase tracking-widest"
            >
              <option value={30}>Últimos 30 dias</option>
              <option value={60}>Últimos 60 dias</option>
              <option value={90}>Últimos 90 dias</option>
              <option value={180}>Últimos 180 dias</option>
            </select>
         </div>

         <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase">Risco:</span>
              <input 
                type="number" 
                value={riskDays} 
                onChange={e => setRiskDays(Number(e.target.value))} 
                className="w-10 bg-transparent font-black text-xs text-slate-700 outline-none"
              />
              <span className="text-[9px] font-black text-slate-400 uppercase">dias s/ voltar</span>
            </div>
         </div>

         <div className="flex items-center gap-3 ml-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base ativa apenas</span>
            <button 
              onClick={() => setActiveOnly(!activeOnly)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${activeOnly ? 'bg-primary' : 'bg-slate-200'}`}
            >
               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${activeOnly ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
         </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Base Ativa" value={metrics.totalCustomers} subValue={`Clientes (${days}d)`} icon={Users} color="bg-primary" />
        <MetricCard title="Frequência" value={metrics.avgFrequency.toFixed(2)} subValue="Visitas/Cliente" icon={RefreshCcw} color="bg-accent" />
        <MetricCard title="Retenção" value={`${metrics.retentionRate.toFixed(1)}%`} subValue="Voltaram 2x+" icon={Target} color="bg-emerald-500" />
        <MetricCard title="Tempo Retorno" value={Math.round(metrics.avgReturnDays)} subValue="Dias (Média)" icon={Clock} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recurrence Segmentation */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Segmentação por Recorrência</h3>
                 <p className="text-slate-400 font-medium text-sm">Quantos clientes estão evoluindo no seu funil de fidelidade.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {segmentationData.map(seg => (
                <div key={seg.name} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 space-y-4">
                   <div className="flex justify-between items-center">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }}></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase">{((seg.value / metrics.totalCustomers) * 100).toFixed(0)}%</span>
                   </div>
                   <h4 className="text-3xl font-black text-slate-900">{seg.value}</h4>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{seg.name}</p>
                </div>
              ))}
           </div>

           <div className="h-[200px] w-full mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentationData} layout="vertical" margin={{ left: -20 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" hide />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                      {segmentationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Opportunities Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl space-y-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-black uppercase tracking-tight">Oportunidades</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-xs font-medium text-white/70 leading-relaxed">
                          Você tem <span className="text-accent font-black">{metrics.segmentation.loyal} clientes fiéis</span>. Crie um programa de recompensas exclusivo para blindar essa base.
                       </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-xs font-medium text-white/70 leading-relaxed">
                          Promotores visitam o seu negócio <span className="text-emerald-400 font-black">{(metrics.npsCorrelation.promoter / (metrics.npsCorrelation.detractor || 1)).toFixed(1)}x mais</span> que detratores. A experiência é seu motor de lucro.
                       </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-xs font-medium text-white/70 leading-relaxed">
                          Existem <span className="text-red-400 font-black">{atRisk.length} clientes em risco</span> que já foram recorrentes e não voltam há {riskDays} dias.
                       </p>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-accent text-white font-black rounded-2xl shadow-lg shadow-accent/20 uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                    Solicitar Mentoria de Crescimento
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
           </section>

           <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-red-500" /> Top em Risco
              </h3>
              <div className="space-y-3">
                 {atRisk.map(c => (
                   <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-[10px] text-slate-400">{c.name.charAt(0)}</div>
                         <div>
                            <p className="text-[11px] font-black text-slate-800 line-clamp-1">{c.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{c.totalFeedbacks} Visitas</p>
                         </div>
                      </div>
                      <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all">
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
                 {atRisk.length === 0 && <p className="text-[10px] text-slate-300 font-bold text-center py-4">Nenhum cliente em risco detectado.</p>}
              </div>
           </section>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Distribution */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Perfil Etário e Frequência</h3>
                 <p className="text-slate-400 font-medium text-sm">Quem mais frequenta seu estabelecimento.</p>
              </div>
           </div>

           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} hide />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar yAxisId="left" dataKey="count" name="Clientes" fill="#0047a7" radius={[10, 10, 0, 0]} barSize={30} />
                    <Bar yAxisId="right" dataKey="avgVisits" name="Freq. Média" fill="#ff6800" radius={[10, 10, 0, 0]} barSize={10} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-primary rounded-full"></div>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Clientes</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-accent rounded-full"></div>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Frequência Média</span>
              </div>
           </div>
        </section>

        {/* NPS x Return Correlation */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div>
              <h3 className="text-xl font-black text-slate-900">NPS x Fidelidade</h3>
              <p className="text-slate-400 font-medium text-sm">O impacto da satisfação no retorno do cliente.</p>
           </div>

           <div className="space-y-8 py-4">
              {npsCorrelationData.map(item => (
                <div key={item.name} className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                         <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{item.value.toFixed(1)} <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Visitas Médias</span></span>
                   </div>
                   <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000 ease-out shadow-sm" 
                        style={{ 
                          width: `${(item.value / Math.max(...npsCorrelationData.map(i => i.value))) * 100}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
              <Zap className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                 <strong>Insight de Retorno:</strong> No seu negócio, um <strong>Promotor</strong> tende a visitar o estabelecimento <span className="font-black">{(metrics.npsCorrelation.promoter / (metrics.npsCorrelation.detractor || 1)).toFixed(1)} vezes mais</span> do que um cliente insatisfeito. 
                 Investir em resolver os casos de detratores pode aumentar sua recorrência base em até 15%.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Growth;

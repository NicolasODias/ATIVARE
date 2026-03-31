
import React, { useState, useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { 
  Globe, 
  MapPin, 
  Filter, 
  TrendingUp, 
  Award, 
  Target, 
  ChevronUp, 
  ChevronDown, 
  Trophy, 
  Medal,
  Info,
  ShieldCheck,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface BenchmarkingProps {
  companyId: string;
}

const Benchmarking: React.FC<BenchmarkingProps> = ({ companyId }) => {
  const [segment, setSegment] = useState<string>('');
  const [region, setRegion] = useState<string>('Toda a Plataforma');
  const [timeRange, setTimeRange] = useState<number>(30);

  const stats = useMemo(() => dataStore.getBenchmarkingData(companyId, segment || undefined), [companyId, segment]);
  const company = useMemo(() => dataStore.getCompany(companyId), [companyId]);

  if (!stats || !company) return null;

  const radarData = [
    { subject: 'Atendimento', A: stats.marketCatAvg.service * 10, B: (dataStore.getDashboardStats(companyId).catAvg.service || 0) * 10, fullMark: 100 },
    { subject: 'Comida', A: stats.marketCatAvg.food * 10, B: (dataStore.getDashboardStats(companyId).catAvg.food || 0) * 10, fullMark: 100 },
    { subject: 'Bebidas', A: stats.marketCatAvg.drinks * 10, B: (dataStore.getDashboardStats(companyId).catAvg.drinks || 0) * 10, fullMark: 100 },
    { subject: 'Estrutura', A: stats.marketCatAvg.structure * 10, B: (dataStore.getDashboardStats(companyId).catAvg.structure || 0) * 10, fullMark: 100 },
    { subject: 'Espera', A: 75, B: 82, fullMark: 100 }, // Mock de espera para o radar ficar completo
  ];

  const delta = stats.currentScore - stats.marketAverage;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={segment || company.category} 
              onChange={(e) => setSegment(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none"
            >
              <option value="Restaurante">Restaurantes</option>
              <option value="Hamburgueria">Hamburguerias</option>
              <option value="Pizzaria">Pizzarias</option>
              <option value="Bar / Pub">Bares & Pubs</option>
            </select>
         </div>

         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none"
            >
              <option>Toda a Plataforma</option>
              <option>Meu Estado</option>
              <option>Minha Cidade</option>
            </select>
         </div>

         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none"
            >
              <option value={7}>Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>
         </div>

         <div className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Dados Anônimos & Agregados
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stats Cards */}
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Seu Score</p>
                 <h4 className="text-4xl font-black text-slate-900">{stats.currentScore}</h4>
                 <div className="absolute top-6 right-6 p-2 bg-primary/5 text-primary rounded-xl group-hover:scale-110 transition-all">
                    <Target className="w-5 h-5" />
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Média Mercado</p>
                 <h4 className="text-4xl font-black text-slate-900">{stats.marketAverage}</h4>
                 <div className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-xl">
                    <Globe className="w-5 h-5" />
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Comparativo</p>
                 <div className="flex items-center gap-2">
                    <h4 className={`text-4xl font-black ${delta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                       {delta > 0 ? `+${delta}` : delta}
                    </h4>
                    {delta >= 0 ? <ChevronUp className="w-6 h-6 text-emerald-500" /> : <ChevronDown className="w-6 h-6 text-red-500" />}
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Acima do segmento</p>
              </div>
           </div>

           {/* Percentile Section */}
           <div className="bg-gradient-to-br from-[#0047a7] to-[#002e6b] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
                       <Award className="w-4 h-4 text-accent" /> Performance Regional
                    </div>
                    <h2 className="text-4xl font-black tracking-tight">Você está no <span className="text-accent">Top {100 - stats.percentile}%</span> <br/>do mercado nacional.</h2>
                    <p className="text-white/60 font-medium max-w-sm">Este cálculo considera todas as {stats.totalInSegment} empresas do segmento "{segment || company.category}" ativas na plataforma.</p>
                 </div>
                 <div className="w-40 h-40 rounded-full border-[10px] border-white/10 flex items-center justify-center relative">
                    <div className="text-center">
                       <span className="text-4xl font-black block">{stats.position}º</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Posição</span>
                    </div>
                    <div className="absolute inset-0 border-[10px] border-accent rounded-full" style={{ clipPath: `inset(0 0 ${100 - stats.percentile}% 0)` }}></div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           </div>

           {/* Detailed Comparison Chart */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Análise de Pilares</h3>
                    <p className="text-slate-400 font-medium text-sm">Comparação direta por categoria de experiência.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-primary"></div>
                       <span className="text-[10px] font-black uppercase text-slate-400">Você</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                       <span className="text-[10px] font-black uppercase text-slate-400">Média Segmento</span>
                    </div>
                 </div>
              </div>

              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                       <PolarGrid stroke="#f1f5f9" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                       <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                       <Radar name="Mercado" dataKey="A" stroke="#e2e8f0" fill="#f8fafc" fillOpacity={0.6} />
                       <Radar name="Você" dataKey="B" stroke="#0047a7" fill="#0047a7" fillOpacity={0.4} />
                       <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                       />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Ranking Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl"><Trophy className="w-5 h-5" /></div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Ranking do Segmento</h3>
                    <p className="text-slate-400 font-medium text-xs">As melhores experiências da rede.</p>
                 </div>
              </div>

              <div className="space-y-4 flex-1">
                 {stats.ranking.map((rank, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        rank.name === company.name 
                          ? 'bg-primary/5 border-primary shadow-sm' 
                          : 'bg-slate-50 border-slate-100 border-transparent hover:bg-slate-100'
                      }`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                            idx === 0 ? 'bg-amber-100 text-amber-600' :
                            idx === 1 ? 'bg-slate-200 text-slate-600' :
                            idx === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-white text-slate-400'
                          }`}>
                            {idx < 3 ? <Medal className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-800 line-clamp-1">{rank.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{segment || company.category}</p>
                          </div>
                       </div>
                       <span className="text-base font-black text-slate-900">{rank.score}</span>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-start gap-3">
                 <Info className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                    O ranking é atualizado em tempo real. Para participar, sua empresa precisa ter recebido no mínimo 10 avaliações nos últimos 30 dias.
                 </p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Benchmarking;


import React, { useState, useEffect, useMemo } from 'react';
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
  BarChart3,
  Lock,
  MessageSquare,
  Sparkles,
  Loader2,
  ChevronRight,
  QrCode,
  Users,
  Gift,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';

interface BenchmarkingProps {
  companyId: string;
}

const Benchmarking: React.FC<BenchmarkingProps> = ({ companyId }) => {
  const [segment, setSegment] = useState<string>('');
  const [region, setRegion] = useState<string>('Toda a Plataforma');
  const [timeRange, setTimeRange] = useState<number>(30);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTips, setShowTips] = useState(false);

  // Carrega os dados reais do service
  const fetchBenchmarkData = async () => {
    setLoading(true);
    const data = await dataStore.getBenchmarkingData(companyId, segment || undefined);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBenchmarkData();
  }, [companyId, segment]);

  const company = useMemo(() => dataStore.getCompany(companyId), [companyId]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sincronizando dados de mercado...</p>
      </div>
    );
  }

  if (!stats || !company) return null;

  const isEligible = stats.isEligible;
  const currentTotal = stats.totalEvaluations;
  const minRequired = stats.minEvaluationsRequired;
  
  const evaluationsLeft = Math.max(0, minRequired - currentTotal);
  const progressPercent = Math.min(100, (currentTotal / minRequired) * 100);

  const radarData = [
    { subject: 'Atendimento', A: stats.marketCatAvg.service * 10, B: (dataStore.getDashboardStats(companyId).catAvg.service || 0) * 10 },
    { subject: 'Comida', A: stats.marketCatAvg.food * 10, B: (dataStore.getDashboardStats(companyId).catAvg.food || 0) * 10 },
    { subject: 'Bebidas', A: stats.marketCatAvg.drinks * 10, B: (dataStore.getDashboardStats(companyId).catAvg.drinks || 0) * 10 },
    { subject: 'Estrutura', A: stats.marketCatAvg.structure * 10, B: (dataStore.getDashboardStats(companyId).catAvg.structure || 0) * 10 },
    { subject: 'Espera', A: 75, B: 82 },
  ];

  const delta = stats.currentScore - stats.marketAverage;

  if (!isEligible) {
    const tips = [
      {
        icon: QrCode,
        title: "QR Code Estratégico",
        desc: "Coloque totens em todas as mesas e no balcão de fechamento.",
        color: "text-blue-500",
        bg: "bg-blue-50"
      },
      {
        icon: Users,
        title: "Incentivo à Equipe",
        desc: "Treine o staff para pedir a avaliação citando o nome do colaborador.",
        color: "text-indigo-500",
        bg: "bg-indigo-50"
      },
      {
        icon: Gift,
        title: "Mimo por Opinião",
        desc: "Ofereça um café ou sobremesa em troca do feedback honesto.",
        color: "text-accent",
        bg: "bg-orange-50"
      },
      {
        icon: Smartphone,
        title: "WhatsApp Automático",
        desc: "Envie o link direto após 1h do fechamento da conta do cliente.",
        color: "text-emerald-500",
        bg: "bg-emerald-50"
      }
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl text-center space-y-10 relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary animate-bounce">
                <Lock className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tight">Benchmarking Bloqueado</h2>
                 <p className="text-lg text-slate-400 font-medium max-w-xl mx-auto">
                    Para garantir a precisão estatística do ranking nacional, seu negócio precisa de pelo menos **{minRequired} avaliações reais**.
                 </p>
              </div>
              
              <div className="max-w-md mx-auto space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Progresso de Elegibilidade</span>
                    <span className="text-xl font-black text-slate-900">{currentTotal} <span className="text-slate-300">/ {minRequired}</span></span>
                 </div>
                 <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200 shadow-inner">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${progressPercent}%` }}></div>
                 </div>
                 <p className="text-xs font-bold text-slate-500 uppercase">
                    Faltam apenas <span className="text-primary font-black">{evaluationsLeft} avaliações</span> para você desbloquear os dados de mercado!
                 </p>
              </div>

              <div className="pt-6 flex flex-col items-center gap-6">
                 <button 
                   onClick={() => setShowTips(!showTips)}
                   className="px-10 py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
                 >
                    <Sparkles className={`w-5 h-5 text-accent ${showTips ? 'rotate-180' : ''} transition-transform duration-500`} /> 
                    {showTips ? 'Ocultar Estratégias' : 'Aumentar Engajamento'}
                 </button>

                 {showTips && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl animate-in slide-in-from-top duration-500">
                      {tips.map((tip, i) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left flex items-start gap-4 hover:bg-white hover:shadow-lg transition-all group">
                           <div className={`p-3 rounded-2xl ${tip.bg} ${tip.color} group-hover:scale-110 transition-transform`}>
                              <tip.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight mb-1">{tip.title}</h4>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">{tip.desc}</p>
                           </div>
                        </div>
                      ))}
                      <div className="md:col-span-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dica Extra: Ative a Consultoria Guardiã para análise profunda</span>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none grayscale">
              <Globe className="w-full h-full" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
              <Trophy className="w-8 h-8 text-amber-500" />
              <h4 className="text-lg font-black">Ranking Nacional</h4>
              <p className="text-sm text-slate-400 font-medium">Saiba exatamente qual sua posição entre as melhores unidades do Brasil.</p>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
              <Target className="w-8 h-8 text-primary" />
              <h4 className="text-lg font-black">Metas de Pilar</h4>
              <p className="text-sm text-slate-400 font-medium">Descubra em quais categorias seu setor é forte e onde você precisa focar.</p>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              <h4 className="text-lg font-black">BI de Mercado</h4>
              <p className="text-sm text-slate-400 font-medium">Acesso a dados médios de satisfação de toda a rede Ativare.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
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
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none">
              <option>Toda a Plataforma</option>
              <option>Meu Estado</option>
              <option>Minha Cidade</option>
            </select>
         </div>

         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="bg-transparent text-sm font-bold text-slate-700 outline-none">
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

           <div className="bg-gradient-to-br from-[#0047a7] to-[#002e6b] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
                       <Award className="w-4 h-4 text-accent" /> Performance Regional
                    </div>
                    <h2 className="text-4xl font-black tracking-tight leading-tight">Você está no <span className="text-accent">Top {100 - stats.percentile}%</span> <br/>do mercado nacional.</h2>
                    <p className="text-white/60 font-medium max-w-sm">Este cálculo considera todas as {stats.totalInSegment} empresas do segmento "{segment || company.category}" elegíveis.</p>
                 </div>
                 <div className="w-40 h-40 rounded-full border-[10px] border-white/10 flex items-center justify-center relative">
                    <div className="text-center">
                       <span className="text-4xl font-black block">{stats.position}º</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Posição</span>
                    </div>
                    <div className="absolute inset-0 border-[10px] border-accent rounded-full" style={{ clipPath: `inset(0 0 ${100 - stats.percentile}% 0)` }}></div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Análise de Pilares</h3>
                    <p className="text-slate-400 font-medium text-sm">Comparação direta por categoria de experiência.</p>
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
                       <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

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
                    Sua elegibilidade é permanente após atingir {minRequired} avaliações reais. O ranking é atualizado em tempo real.
                 </p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Benchmarking;

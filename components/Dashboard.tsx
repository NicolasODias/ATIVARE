
import React from 'react';
import { dataStore } from '../services/dataStore';
import { MOCK_COMPANIES, COLORS } from '../constants';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Smile, 
  Meh, 
  Frown, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Activity,
  Award,
  Clock,
  Hash,
  MapPin,
  Plane,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  companyId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ companyId }) => {
  const stats = dataStore.getDashboardStats(companyId);
  const company = dataStore.getCompany(companyId);
  
  const chartData = [
    { name: 'Seg', score: stats.avgScore - 5 },
    { name: 'Ter', score: stats.avgScore - 2 },
    { name: 'Qua', score: stats.avgScore + 3 },
    { name: 'Qui', score: stats.avgScore + 1 },
    { name: 'Sex', score: stats.avgScore + 8 },
    { name: 'Sáb', score: stats.avgScore + 4 },
    { name: 'Dom', score: stats.avgScore },
  ];

  // Cálculo de trial
  const getRemainingTrialDays = () => {
    if (!company?.trialEndDate) return null;
    const end = new Date(company.trialEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const trialDays = getRemainingTrialDays();

  const MetricCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        <span className="text-xs font-medium text-slate-400">{subValue}</span>
      </div>
    </div>
  );

  const RatingDotsView = ({ label, value }: { label: string, value: number }) => {
    const rounded = Math.round(value);
    const getColorClass = (val: number) => {
      if (val <= 3) return 'bg-red-500';
      if (val <= 6) return 'bg-yellow-400';
      return 'bg-emerald-500';
    };
    const activeColor = getColorClass(rounded);

    return (
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-wide text-slate-400">
          <span>{label}</span>
          <span className={`font-black text-sm ${rounded <= 3 ? 'text-red-500' : rounded <= 6 ? 'text-yellow-600' : 'text-emerald-500'}`}>
            {value.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                i + 1 <= rounded ? activeColor : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Tracking Code Banner */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/5 text-primary rounded-lg">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seu Código Ativare</p>
              <p className="text-lg font-black text-slate-900 tracking-[0.1em]">{company?.trackingCode}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(company?.trackingCode || '');
              alert('Código copiado!');
            }}
            className="text-[10px] font-black text-primary uppercase bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all"
          >
            Copiar Código
          </button>
        </div>

        {/* Trial Banner */}
        {trialDays !== null && trialDays > 0 && (
          <div className="flex-[2] bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top duration-700 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Seu período de degustação termina em {trialDays} dias.</p>
                <p className="text-xs text-amber-700">Aproveite todos os recursos do Ativare Experience!</p>
              </div>
            </div>
            <button className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
              Ativar Agora
            </button>
          </div>
        )}
      </div>

      {/* Experience Score Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0047a7] to-[#002e6b] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                <Activity className="w-3 h-3" />
                <span>Índice de Experiência</span>
              </div>
              <h2 className="text-4xl font-black leading-tight">Sua reputação está em <br/><span className="text-accent italic font-black">ascensão!</span></h2>
              <p className="text-white/70 max-w-md text-sm">Baseado nas últimas avaliações recebidas. Recalculado automaticamente todos os domingos.</p>
              <div className="flex space-x-4 pt-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-white/50 uppercase font-bold">Total Avaliações</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-white/50 uppercase font-bold">Status Atual</p>
                  <p className="text-2xl font-bold">{stats.avgScore >= 80 ? 'Excelente' : stats.avgScore >= 60 ? 'Bom' : 'Atenção'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0 flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={502.4} 
                    strokeDashoffset={502.4 - (502.4 * stats.avgScore) / 100} 
                    className="text-accent transition-all duration-1000 ease-out" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-black">{stats.avgScore}</span>
                  <span className="text-xs uppercase font-bold text-white/60">de 100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Award className="w-5 h-5 text-accent" />
            <span>Categorias de Satisfação</span>
          </h3>
          <div className="flex-1 space-y-8">
            <RatingDotsView label="Atendimento" value={stats.catAvg.service} />
            <RatingDotsView label="Comida" value={stats.catAvg.food} />
            <RatingDotsView label="Bebidas" value={stats.catAvg.drinks} />
            <RatingDotsView label="Estrutura" value={stats.catAvg.structure} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget de Origem do Público */}
        <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Origem do Público
           </h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-emerald-500" /> Moradores</span>
                    <span>{stats.customerTypeDist.local}%</span>
                 </div>
                 <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.customerTypeDist.local}%` }}></div>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2"><Plane className="w-3 h-3 text-indigo-500" /> Turistas</span>
                    <span>{stats.customerTypeDist.tourist}%</span>
                 </div>
                 <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${stats.customerTypeDist.tourist}%` }}></div>
                 </div>
              </div>
           </div>
           <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase">
              O seu estabelecimento é frequentado majoritariamente por <strong>{stats.customerTypeDist.local >= stats.customerTypeDist.tourist ? 'Moradores' : 'Turistas'}</strong>.
           </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
           <MetricCard title="Promotores" value={stats.promoters} subValue={stats.total > 0 ? `${Math.round((stats.promoters/stats.total)*100)}% do total` : '0%'} icon={Smile} color="bg-emerald-500" trend={12} />
           <MetricCard title="Passivos" value={stats.passives} subValue={stats.total > 0 ? `${Math.round((stats.passives/stats.total)*100)}% do total` : '0%'} icon={Meh} color="bg-amber-500" trend={-3} />
           <MetricCard title="Detratores (Abertos)" value={stats.openDetractors} subValue="Casos urgentes" icon={Frown} color="bg-red-500" trend={8} />
           <MetricCard title="Casos Resolvidos" value={stats.resolvedDetractors} subValue="Eficiência de gestão" icon={CheckCircle2} color="bg-blue-500" trend={24} />
        </div>
      </div>

      {/* Evolution Graph */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Evolução Semanal</h3>
            <p className="text-sm text-slate-500">Tendência do Score de Experiência nos últimos 7 dias</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button className="px-4 py-1.5 text-xs font-bold bg-white text-slate-700 shadow-sm rounded-lg">7 dias</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">30 dias</button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0047a7" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0047a7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                labelStyle={{fontWeight: 700, color: '#1e293b'}}
              />
              <Area type="monotone" dataKey="score" stroke="#0047a7" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

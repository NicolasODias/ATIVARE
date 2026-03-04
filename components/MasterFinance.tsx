
import React, { useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  PieChart, 
  Activity, 
  Briefcase, 
  AlertCircle,
  Clock,
  ChevronRight,
  Zap,
  BarChart3,
  HeartHandshake
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const MasterFinance: React.FC = () => {
  const stats = dataStore.getMasterFinanceStats();

  const pipelineData = [
    { name: 'Lead', value: stats.revenueByStage['LEAD'] || 0, count: stats.leadsByStage['LEAD'] || 0 },
    { name: 'Contato', value: stats.revenueByStage['CONTACTED'] || 0, count: stats.leadsByStage['CONTACTED'] || 0 },
    { name: 'Interesse', value: stats.revenueByStage['INTEREST'] || 0, count: stats.leadsByStage['INTEREST'] || 0 },
    { name: 'Proposta', value: stats.revenueByStage['PROPOSAL'] || 0, count: stats.leadsByStage['PROPOSAL'] || 0 },
  ];

  const COLORS = ['#0047a7', '#ff6800', '#10b981', '#6366f1'];

  const MetricCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-black text-slate-900">
          {typeof value === 'number' && (title.includes('R$') || title.includes('Receita')) ? `R$ ${value.toLocaleString('pt-BR')}` : value}
        </h4>
        <span className="text-[10px] font-bold text-slate-400">{subValue}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Top Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Receita MRR" value={stats.mrr} subValue="Mensal Recorrente (WON)" icon={DollarSign} color="bg-primary" trend={12} />
        <MetricCard title="Receita ARR" value={stats.arr} subValue="Anual Estimado" icon={TrendingUp} color="bg-emerald-500" trend={8} />
        <MetricCard title="Setups & Consultoria" value={stats.totalImplementation + stats.totalConsulting} subValue="Receita One-time" icon={Zap} color="bg-amber-500" />
        <MetricCard title="Pipeline Aberto" value={stats.pipelineRevenue} subValue="Potencial em Funil" icon={Target} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart: Pipeline Financeiro */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Health of Pipeline</h3>
                 <p className="text-slate-400 font-medium text-sm">Distribuição de valor potencial por estágio do CRM.</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase text-slate-400">Total Pipeline</p>
                 <p className="text-xl font-black text-primary">R$ {stats.pipelineRevenue.toLocaleString('pt-BR')}</p>
              </div>
           </div>

           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, 'Potencial Mensal']}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                       {pipelineData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Sidebar: Commercial Efficiency */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-black text-slate-900">Eficiência Comercial</h3>
              
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/5 text-primary rounded-xl"><HeartHandshake className="w-4 h-4" /></div>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Taxa de Conversão</span>
                    </div>
                    <span className="text-sm font-black text-emerald-500">{stats.conversionRate.toFixed(1)}%</span>
                 </div>

                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><Users className="w-4 h-4" /></div>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">ARPU (Ticket Médio)</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">R$ {stats.arpu.toFixed(2)}</span>
                 </div>

                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Target className="w-4 h-4" /></div>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Total de Leads</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{stats.leadsCount}</span>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                 <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-6">Base de Clientes Ativos</h4>
                 <div className="p-6 bg-slate-900 rounded-3xl text-white text-center">
                    <p className="text-4xl font-black text-white">{stats.activeClients}</p>
                    <p className="text-[9px] font-bold uppercase text-white/40 mt-1">Empresas Gerando Receita</p>
                 </div>
              </div>
           </section>

           {/* Quick Action */}
           <section className="bg-primary p-8 rounded-[3rem] text-white shadow-xl space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tight">Estratégia do Mês</h3>
              <p className="text-xs text-white/60 leading-relaxed font-medium">Você tem <span className="text-white font-bold">R$ {stats.revenueByStage['PROPOSAL'].toLocaleString('pt-BR')}</span> em propostas enviadas esperando fechamento. Foco total em follow-up hoje!</p>
              <div className="pt-4">
                 <button className="w-full py-3 bg-white text-primary font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Ver Propostas no CRM</button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default MasterFinance;

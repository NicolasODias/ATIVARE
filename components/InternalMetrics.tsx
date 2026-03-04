
import React, { useMemo } from 'react';
import { dataStore } from '../services/dataStore';
import { Target, BarChart, Check, X, MessageSquare, TrendingUp } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InternalMetricsProps {
  companyId: string;
}

const InternalMetrics: React.FC<InternalMetricsProps> = ({ companyId }) => {
  const metrics = useMemo(() => dataStore.getInternalMetrics(companyId), [companyId]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Target className="w-5 h-5" /></div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amostra</p>
                <p className="text-lg font-black text-slate-800">{m.totalResponses} resp.</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-800 leading-tight">{m.text}</p>
              <span className="text-[9px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded">{m.type}</span>
            </div>

            {/* Metric Display based on type */}
            <div className="pt-4 border-t border-slate-50">
              {m.type === 'YES_NO' ? (
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Sim</span>
                      <span className="text-slate-900">{m.average.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${m.average}%` }}></div>
                    </div>
                  </div>
                </div>
              ) : m.type === 'TEXT' ? (
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <MessageSquare className="w-4 h-4" />
                  <span>Ver respostas qualitativas</span>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-primary">{m.average.toFixed(1)}</span>
                  <span className="text-xs font-bold text-slate-400 mb-2">de {m.type === 'SCALE_5' ? '5.0' : '10.0'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Evolution Context */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" /> Tendências Internas
        </h3>
        <div className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={metrics.filter(m => m.type !== 'TEXT').slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="text" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} hide />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="average" fill="#0047a7" radius={[10, 10, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs font-medium text-slate-400 mt-4">Comparativo de performance entre suas métricas personalizadas.</p>
      </div>
    </div>
  );
};

export default InternalMetrics;

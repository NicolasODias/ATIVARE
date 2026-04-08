import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / (duration * 1000), 1);
      
      countRef.current = Math.floor(progress * end);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString('pt-BR')}</span>;
};

export default function Cases() {
  const data1 = [
    { name: 'Dia 1', value: 0 },
    { name: 'Dia 15', value: 12000 },
    { name: 'Dia 30', value: 35000 },
    { name: 'Dia 45', value: 66525 },
  ];

  const data2 = [
    { name: 'Início', value: 6300 },
    { name: '30 Dias', value: 30786 },
  ];

  return (
    <section id="cases" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Resultados Reais</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Nossos <span className="text-brand-orange italic">Cases</span></h2>
          <p className="text-brand-gray max-w-2xl mx-auto text-lg">
            Não falamos de promessas, falamos de faturamento no bolso. Veja o que a execução de elite faz.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Case 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 rounded-[3rem] border-l-4 border-l-brand-orange"
          >
            <div className="mb-8">
              <h3 className="text-brand-gray font-bold uppercase tracking-widest text-sm mb-2">E-commerce de Moda</h3>
              <div className="font-display text-4xl md:text-5xl font-black">
                De R$0 para <span className="text-brand-orange">R$ <CountUp end={66525} /></span>
              </div>
              <p className="text-brand-gray mt-2">em apenas 45 dias de operação.</p>
            </div>

            <div className="h-[300px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data1}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050A14', border: '1px solid rgba(255,107,0,0.3)', borderRadius: '12px' }}
                    itemStyle={{ color: '#FF6B00', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Case 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 md:p-12 rounded-[3rem] border-l-4 border-l-brand-orange"
          >
            <div className="mb-8">
              <h3 className="text-brand-gray font-bold uppercase tracking-widest text-sm mb-2">Loja de Marketplace</h3>
              <div className="font-display text-4xl md:text-5xl font-black">
                Escala de <span className="text-brand-orange"><CountUp end={388} />%</span>
              </div>
              <p className="text-brand-gray mt-2">De R$6.300 para R$30.786 em 30 dias.</p>
            </div>

            <div className="h-[300px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050A14', border: '1px solid rgba(255,107,0,0.3)', borderRadius: '12px' }}
                    itemStyle={{ color: '#FF6B00', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'rgba(255,255,255,0.1)' : '#FF6B00'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

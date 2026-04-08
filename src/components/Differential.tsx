import { motion } from 'motion/react';
import { X, Check, ShieldCheck, Target, Rocket, Users } from 'lucide-react';

export default function Differential() {
  const comparisons = [
    { label: "Operacional", agência: true, ativare: false },
    { label: "Foco em Cliques", agência: true, ativare: false },
    { label: "Barato", agência: true, ativare: false },
    { label: "Estratégico", agência: false, ativare: true },
    { label: "Foco em Faturamento", agência: false, ativare: true },
    { label: "Parceiro de Negócio", agência: false, ativare: true },
  ];

  return (
    <section id="diferenciais" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Não somos uma agência comum</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-8">O que nos torna <span className="text-brand-orange italic">diferentes?</span></h2>
            <p className="text-brand-gray text-lg mb-10 leading-relaxed">
              Agências comuns focam em métricas de vaidade. Nós focamos no que importa: <strong>lucro e escala.</strong> Se você busca o mais barato, não somos para você. Se busca o melhor, seja bem-vindo.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-3xl">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center mb-4">
                  <Target className="text-brand-orange" />
                </div>
                <h4 className="font-bold mb-2">Estratégicos</h4>
                <p className="text-sm text-brand-gray">Pensamos no seu negócio como um todo.</p>
              </div>
              <div className="glass-card p-6 rounded-3xl">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center mb-4">
                  <Rocket className="text-brand-orange" />
                </div>
                <h4 className="font-bold mb-2">Focados em Escala</h4>
                <p className="text-sm text-brand-gray">Nossa meta é multiplicar seu faturamento.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 orange-gradient" />
            <h3 className="font-display text-2xl font-bold mb-10 text-center">ATIVARE vs Agência Comum</h3>
            
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <span className="font-medium text-brand-gray">{item.label}</span>
                  <div className="flex gap-12 md:gap-20">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gray opacity-50 mb-1">Agência</span>
                      {item.agência ? <X className="text-red-500" size={20} /> : <Check className="text-green-500" size={20} />}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-brand-orange mb-1">ATIVARE</span>
                      {item.ativare ? <Check className="text-brand-orange" size={24} strokeWidth={3} /> : <X className="text-red-500" size={20} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

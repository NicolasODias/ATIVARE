import { motion } from 'motion/react';

export default function StartMethod() {
  const steps = [
    { letter: "S", title: "Estruturar", desc: "Organizamos a base da sua operação para suportar o crescimento." },
    { letter: "T", title: "Posicionar", desc: "Criamos uma identidade forte que diferencia sua marca no mercado." },
    { letter: "A", title: "Validar", desc: "Testamos estratégias e canais para encontrar o que realmente traz lucro." },
    { letter: "R", title: "Escalar", desc: "Aceleramos o que funciona para levar seu faturamento a novos níveis." },
  ];

  return (
    <section id="metodo" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Metodologia Exclusiva</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold">Método <span className="text-brand-orange">START</span></h2>
          </div>
          <p className="text-brand-gray max-w-md text-lg">
            Um framework validado para transformar e-commerces comuns em líderes de categoria.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.letter}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="glass-card p-8 rounded-3xl h-full flex flex-col items-start hover:bg-brand-orange/5 transition-all duration-500">
                <div className="font-display text-7xl font-black text-white/5 group-hover:text-brand-orange/20 transition-colors absolute top-4 right-8">
                  {step.letter}
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center font-display font-bold text-2xl mb-6 shadow-[0_0_20px_rgba(255,107,0,0.4)]">
                  {step.letter}
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-brand-gray leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

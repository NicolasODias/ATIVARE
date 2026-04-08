import { motion } from 'motion/react';
import { ShoppingBag, Store, Briefcase } from 'lucide-react';

export default function TargetAudience() {
  const targets = [
    { icon: <ShoppingBag size={32} />, title: "Donos de Loja Online", desc: "Para quem já vende e quer profissionalizar a operação para escalar." },
    { icon: <Store size={32} />, title: "Vendedores de Marketplace", desc: "Para quem quer sair da dependência de terceiros e criar marca própria." },
    { icon: <Briefcase size={32} />, title: "Empresários Visionários", desc: "Para quem entende que o digital é o único caminho para o crescimento real." },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Para <span className="text-brand-orange italic">quem é?</span></h2>
          <p className="text-brand-gray max-w-2xl mx-auto text-lg">
            Nosso método não é para todos. É para quem está disposto a executar e crescer de verdade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {targets.map((target, index) => (
            <motion.div
              key={target.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-10 rounded-[3rem] text-center group hover:border-brand-orange/50 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-orange/20 transition-colors">
                <div className="text-brand-gray group-hover:text-brand-orange transition-colors">
                  {target.icon}
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-brand-orange transition-colors">
                {target.title}
              </h3>
              <p className="text-brand-gray leading-relaxed">
                {target.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

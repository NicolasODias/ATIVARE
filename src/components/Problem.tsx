import { motion } from 'motion/react';
import { XCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from '../FormContext';

export default function Problem() {
  const { openForm } = useForm();
  const cards = [
    { title: "Não é produto", desc: "Muitos focam apenas no que vendem, esquecendo de como vendem." },
    { title: "Não é mercado", desc: "O mercado está saturado apenas para quem não sabe se posicionar." },
    { title: "É execução", desc: "A diferença entre o topo e a base é a capacidade de executar com excelência." },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold mb-6"
          >
            Por que sua loja <span className="text-brand-orange italic">travou?</span>
          </motion.h2>
          <p className="text-brand-gray max-w-2xl mx-auto">
            Esqueça as desculpas comuns. O problema real é mais profundo e nós sabemos exatamente onde ele está.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8 rounded-3xl group hover:border-brand-orange/50 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-orange/20 transition-colors">
                <XCircle className="text-brand-gray group-hover:text-brand-orange transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-brand-orange transition-colors">
                {card.title}
              </h3>
              <p className="text-brand-gray leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 md:p-12 rounded-[2rem] bg-brand-orange/5 border border-brand-orange/20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <h4 className="font-display text-2xl md:text-3xl font-bold mb-4">
              A ATIVARE resolve o gargalo da <span className="text-brand-orange">execução.</span>
            </h4>
            <p className="text-brand-gray">
              Nós não apenas damos o caminho, nós construímos a estrada e dirigimos o carro junto com você.
            </p>
          </div>
          <button 
            onClick={openForm}
            className="orange-gradient px-8 py-4 rounded-full font-bold whitespace-nowrap hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,107,0,0.2)]"
          >
            Quero destravar minha loja
          </button>
        </motion.div>
      </div>
    </section>
  );
}

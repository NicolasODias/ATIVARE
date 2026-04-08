import { motion } from 'motion/react';
import { Layout, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useForm } from '../FormContext';

export default function HowItWorks() {
  const { openForm } = useForm();
  const pillars = [
    {
      title: "ASSESSORIA",
      subtitle: "Estrutura completa da loja",
      icon: <Layout className="text-brand-orange" />,
      items: [
        "Configuração de plataforma",
        "Integração de ERP e Logística",
        "Otimização de checkout",
        "Design de alta conversão",
        "Configuração de rastreamento"
      ]
    },
    {
      title: "CONSULTORIA",
      subtitle: "Crescimento contínuo e escala",
      icon: <TrendingUp className="text-brand-orange" />,
      items: [
        "Gestão de tráfego pago",
        "Análise de dados avançada",
        "Estratégias de retenção (CRM)",
        "Escala de faturamento",
        "Acompanhamento estratégico semanal"
      ]
    }
  ];

  return (
    <section id="como-funciona" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Como <span className="text-brand-orange italic">funcionamos</span></h2>
          <p className="text-brand-gray max-w-2xl mx-auto text-lg">
            Dividimos nossa expertise em dois pilares fundamentais para garantir que sua loja tenha a base e o motor necessários para o sucesso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12 rounded-[3rem] relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-brand-orange/10 transition-all duration-700" />
              
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-display text-3xl font-black tracking-tighter text-brand-orange">{pillar.title}</h3>
                  <p className="text-brand-gray font-medium">{pillar.subtitle}</p>
                </div>
              </div>

              <ul className="space-y-6">
                {pillar.items.map((item) => (
                  <li key={item} className="flex items-center gap-4 group/item">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center group-hover/item:bg-brand-orange transition-colors">
                      <CheckCircle2 size={14} className="text-brand-orange group-hover/item:text-white transition-colors" />
                    </div>
                    <span className="text-brand-gray group-hover/item:text-white transition-colors text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={openForm}
                className="mt-12 w-full py-4 rounded-2xl border border-brand-orange/30 font-bold hover:bg-brand-orange hover:text-white transition-all duration-300"
              >
                Saiba mais sobre {pillar.title.toLowerCase()}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { PlayCircle, GraduationCap, BookOpen, Star } from 'lucide-react';

export default function EducationalPlatform() {
  const features = [
    { icon: <PlayCircle size={20} />, title: "Aulas Gravadas", desc: "Acesso total ao nosso acervo de estratégias validadas." },
    { icon: <GraduationCap size={20} />, title: "Treinamentos", desc: "Formação contínua para você e sua equipe de vendas." },
    { icon: <BookOpen size={20} />, title: "Estratégias", desc: "Playbooks detalhados de cada etapa do método START." },
  ];

  return (
    <section className="py-24 px-6 bg-white/[0.02] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            {/* Area de Membros Preview */}
            <div className="glass-card p-6 rounded-[3rem] shadow-[0_0_50px_rgba(255,107,0,0.1)] relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                    <Star className="text-brand-orange" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Ecossistema ATIVARE</h4>
                    <p className="text-xs text-brand-gray">Área de Membros Premium</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                  Ativo
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlayCircle className="text-brand-orange group-hover:scale-110 transition-transform" />
                </div>
                <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlayCircle className="text-brand-orange group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 orange-gradient" />
                </div>
                <div className="flex justify-between text-xs font-bold text-brand-gray">
                  <span>Progresso do Treinamento</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-orange/5 blur-[100px] rounded-full -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">Alto Valor Percebido</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-8">Ecossistema de <span className="text-brand-orange italic">Crescimento</span></h2>
            <p className="text-brand-gray text-lg mb-10 leading-relaxed">
              Não somos apenas uma consultoria. Oferecemos um ecossistema completo para que você e sua equipe dominem as estratégias mais avançadas do mercado.
            </p>

            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                    <div className="text-brand-gray group-hover:text-brand-orange transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 group-hover:text-brand-orange transition-colors">{feature.title}</h4>
                    <p className="text-sm text-brand-gray leading-relaxed">{feature.desc}</p>
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

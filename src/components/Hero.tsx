import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Zap, TrendingUp, ShoppingCart, Bell, DollarSign } from 'lucide-react';
import { useForm } from '../FormContext';
import { useState, useEffect, useRef } from 'react';

const GrowthCounter = ({ end, prefix = "R$ " }: { end: number, prefix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 3;
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
  }, [end]);

  return <span>{prefix}{count.toLocaleString('pt-BR')}</span>;
};

export default function Hero() {
  const { openForm } = useForm();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
          style={{ y, opacity }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} />
            Performance Digital de Elite
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            A maioria das lojas não cresce por <span className="text-brand-orange text-glow italic">falta de execução.</span>
          </h1>
          
          <p className="text-brand-gray text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Transformamos operações em máquinas de vendas previsíveis. Chega de amadorismo. É hora de escalar com estratégia real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={openForm}
              className="orange-gradient px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,107,0,0.3)]"
            >
              Agendar diagnóstico gratuito
              <ArrowRight size={20} />
            </button>
            <a 
              href="#metodo"
              className="glass-card px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Conhecer método
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">Parceiros de Escala</span>
            <div className="flex items-center gap-8">
              <div className="font-display font-bold text-xl text-white/40 hover:text-white transition-colors cursor-default">MELI</div>
              <div className="font-display font-bold text-xl text-white/40 hover:text-white transition-colors cursor-default">META</div>
              <div className="font-display font-bold text-xl text-white/40 hover:text-white transition-colors cursor-default">GOOGLE</div>
              
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-[10px] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(255,107,0,0.2)]"
              >
                +4 plataformas
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Growth Animation Visual */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-orange/10 blur-[120px] rounded-full animate-pulse-slow" />
            
            {/* Animated Chart Background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
              <motion.path
                d="M 50 350 Q 150 300 200 200 T 350 50"
                fill="none"
                stroke="url(#orangeGradient)"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />
              <defs>
                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#FF9E44" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating UI Elements */}
            <div className="relative z-10 w-full max-w-md space-y-4">
              {/* Main Revenue Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="glass-card p-6 rounded-3xl border-l-4 border-l-brand-orange shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                      <TrendingUp className="text-brand-orange" size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-brand-gray tracking-widest">Faturamento Real</div>
                      <div className="text-2xl font-display font-black text-white">
                        <GrowthCounter end={250000} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-green-500">+420%</div>
                    <div className="text-[8px] text-brand-gray">vs mês anterior</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full orange-gradient" 
                  />
                </div>
              </motion.div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="glass-card p-4 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ShoppingCart className="text-blue-400" size={16} />
                  </div>
                  <div>
                    <div className="text-[8px] uppercase font-bold text-brand-gray">Pedidos</div>
                    <div className="text-sm font-display font-bold">1.420</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="glass-card p-4 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                    <DollarSign className="text-brand-orange" size={16} />
                  </div>
                  <div>
                    <div className="text-[8px] uppercase font-bold text-brand-gray">Ticket Médio</div>
                    <div className="text-sm font-display font-bold">R$ 176,00</div>
                  </div>
                </motion.div>
              </div>

              {/* Notification Pulse */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 glass-card p-3 rounded-2xl border border-brand-orange/30 shadow-[0_0_20px_rgba(255,107,0,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="text-brand-orange" size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-orange rounded-full animate-ping" />
                  </div>
                  <div className="text-[10px] font-bold">Venda realizada!</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

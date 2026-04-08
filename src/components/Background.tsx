import { motion } from 'motion/react';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-brand-dark">
      {/* Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 blur-[120px] rounded-full animate-pulse-slow" />
      
      {/* Abstract lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 107, 0, 0)" />
            <stop offset="50%" stopColor="rgba(255, 107, 0, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 107, 0, 0)" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M-100 200 C 200 100, 400 300, 800 150 S 1200 400, 1600 250"
          stroke="url(#line-gradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.path
          d="M-100 500 C 300 400, 600 600, 1000 450 S 1400 700, 1800 550"
          stroke="url(#line-gradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }}
        />

        <motion.path
          d="M-100 800 C 100 700, 500 900, 900 750 S 1300 1000, 1700 850"
          stroke="url(#line-gradient)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </svg>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} 
      />
    </div>
  );
}

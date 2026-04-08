import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { useForm } from '../FormContext';

export default function Navbar() {
  const { openForm } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Método', href: '#metodo' },
    { name: 'Como Funciona', href: '#como-funciona' },
    { name: 'Cases', href: '#cases' },
    { name: 'Diferenciais', href: '#diferenciais' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card rounded-full px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center font-display font-bold text-white text-xl">
            A
          </div>
          <span className="font-display font-bold text-xl tracking-tighter">ATIVARE</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-brand-gray hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={openForm}
            className="orange-gradient px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95"
          >
            Diagnóstico Gratuito
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden glass-card mt-2 rounded-2xl mx-auto max-w-[calc(100vw-3rem)]"
      >
        <div className="flex flex-col gap-4 p-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-brand-gray hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => { setIsOpen(false); openForm(); }}
            className="orange-gradient w-full py-3 rounded-xl text-base font-bold"
          >
            Diagnóstico Gratuito
          </button>
        </div>
      </motion.div>
    </nav>
  );
}

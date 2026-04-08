import { motion } from 'motion/react';
import { ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useForm } from '../FormContext';

export default function Footer() {
  const { openForm } = useForm();
  return (
    <footer className="relative pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden mb-24"
        >
          <div className="absolute inset-0 bg-brand-orange/10 blur-[100px] rounded-full -z-10" />
          
          <h2 className="font-display text-4xl md:text-7xl font-black mb-8 leading-tight">
            Se sua loja já vende, ela pode <span className="text-brand-orange italic text-glow">vender muito mais.</span>
          </h2>
          
          <p className="text-brand-gray text-xl max-w-2xl mx-auto mb-12">
            O próximo nível do seu negócio está a um diagnóstico de distância. Vamos escalar?
          </p>
          
          <button 
            onClick={openForm}
            className="orange-gradient px-12 py-6 rounded-full text-xl font-bold flex items-center justify-center gap-3 mx-auto hover:scale-105 transition-transform active:scale-95 shadow-[0_0_50px_rgba(255,107,0,0.4)]"
          >
            Falar com especialista agora
            <ArrowRight size={24} />
          </button>
        </motion.div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center font-display font-bold text-white text-xl">
                A
              </div>
              <span className="font-display font-bold text-xl tracking-tighter">ATIVARE</span>
            </div>
            <p className="text-brand-gray max-w-sm mb-8">
              Transformando e-commerces em máquinas de vendas previsíveis através de execução de elite e estratégia de dados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-4 text-brand-gray">
              <li><a href="#metodo" className="hover:text-brand-orange transition-colors">Método START</a></li>
              <li><a href="#como-funciona" className="hover:text-brand-orange transition-colors">Como Funciona</a></li>
              <li><a href="#cases" className="hover:text-brand-orange transition-colors">Cases de Sucesso</a></li>
              <li><a href="#diferenciais" className="hover:text-brand-orange transition-colors">Diferenciais</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contato</h4>
            <ul className="space-y-4 text-brand-gray">
              <li>contato@ativare.digital</li>
              <li>+55 (11) 99999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-gray">
          <p>© 2026 ATIVARE Performance Digital. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

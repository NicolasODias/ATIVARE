import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, Send, Loader2 } from 'lucide-react';

interface StrategicDiagnosticFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Identificação",
    description: "Comece nos contando quem você é.",
    fields: ["nome", "email", "whatsapp"]
  },
  {
    title: "Sua Empresa",
    description: "Fale um pouco sobre o seu negócio.",
    fields: ["empresa", "funcionarios", "faturamento"]
  },
  {
    title: "Operação",
    description: "Como está sua operação hoje?",
    fields: ["segmento", "plataforma", "dificuldade"]
  }
];

const segments = [
  "Moda e Acessórios",
  "Saúde e Beleza",
  "Casa e Decoração",
  "Eletrônicos e Tecnologia",
  "Alimentos e Bebidas",
  "Infantil",
  "Esportes",
  "Outros"
];

const platforms = [
  "Mercado Livre",
  "Shopee",
  "Amazon",
  "Shopify",
  "Nuvemshop",
  "VTEX",
  "Tray",
  "Magalu",
  "Outra"
];

export default function StrategicDiagnosticForm({ isOpen, onClose }: StrategicDiagnosticFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    empresa: '',
    funcionarios: '',
    faturamento: '',
    segmento: '',
    plataforma: '',
    dificuldade: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Formatar mensagem para WhatsApp
    const message = `Novo lead - Ativare:

Nome: ${formData.nome}
Empresa: ${formData.empresa}
WhatsApp: ${formData.whatsapp}
Email: ${formData.email}
Funcionários: ${formData.funcionarios}
Faturamento: ${formData.faturamento}
Segmento: ${formData.segmento}
Plataforma: ${formData.plataforma}
Dificuldade: ${formData.dificuldade}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5535992360284?text=${encodedMessage}`;

    // Simular um pequeno delay para UX
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        nome: '',
        email: '',
        whatsapp: '',
        empresa: '',
        funcionarios: '',
        faturamento: '',
        segmento: '',
        plataforma: '',
        dificuldade: ''
      });
      setCurrentStep(0);
    }, 1000);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass-card rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(255,107,0,0.15)]"
      >
        {/* Barra de Progresso */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full orange-gradient shadow-[0_0_10px_rgba(255,107,0,0.5)]"
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-10">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2 block">
              Passo {currentStep + 1} de {steps.length}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-brand-gray">{steps[currentStep].description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {currentStep === 0 && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">Nome Completo</label>
                      <input
                        required
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome aqui"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">E-mail Corporativo</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">WhatsApp (com DDD)</label>
                      <input
                        required
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors"
                      />
                    </div>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">Nome da Empresa</label>
                      <input
                        required
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        placeholder="Nome da sua loja ou marca"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">Quantidade de Funcionários</label>
                      <select
                        required
                        name="funcionarios"
                        value={formData.funcionarios}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none"
                      >
                        <option value="" disabled className="bg-brand-dark">Selecione uma opção</option>
                        <option value="1-5" className="bg-brand-dark">1 a 5</option>
                        <option value="6-20" className="bg-brand-dark">6 a 20</option>
                        <option value="21-50" className="bg-brand-dark">21 a 50</option>
                        <option value="50+" className="bg-brand-dark">Mais de 50</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">Faturamento Mensal (Último Mês)</label>
                      <select
                        required
                        name="faturamento"
                        value={formData.faturamento}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none"
                      >
                        <option value="" disabled className="bg-brand-dark">Selecione uma faixa</option>
                        <option value="Até R$ 10k" className="bg-brand-dark">Até R$ 10.000</option>
                        <option value="R$ 10k - R$ 50k" className="bg-brand-dark">R$ 10.000 a R$ 50.000</option>
                        <option value="R$ 50k - R$ 200k" className="bg-brand-dark">R$ 50.000 a R$ 200.000</option>
                        <option value="R$ 200k - R$ 500k" className="bg-brand-dark">R$ 200.000 a R$ 500.000</option>
                        <option value="Acima de R$ 500k" className="bg-brand-dark">Acima de R$ 500.000</option>
                      </select>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-gray ml-1">Segmento</label>
                        <select
                          required
                          name="segmento"
                          value={formData.segmento}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none"
                        >
                          <option value="" disabled className="bg-brand-dark">Selecione</option>
                          {segments.map(s => <option key={s} value={s} className="bg-brand-dark">{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-gray ml-1">Plataforma Atual</label>
                        <select
                          required
                          name="plataforma"
                          value={formData.plataforma}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none"
                        >
                          <option value="" disabled className="bg-brand-dark">Selecione</option>
                          {platforms.map(p => <option key={p} value={p} className="bg-brand-dark">{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-gray ml-1">Principal Dificuldade Hoje</label>
                      <textarea
                        required
                        name="dificuldade"
                        value={formData.dificuldade}
                        onChange={handleChange}
                        placeholder="Ex: Baixa conversão, dificuldade em escalar tráfego, gestão de estoque..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange/50 transition-colors resize-none"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={handleBack}
                className={`flex items-center gap-2 text-brand-gray hover:text-white transition-colors ${currentStep === 0 ? 'invisible' : 'visible'}`}
              >
                <ChevronLeft size={20} />
                Voltar
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="orange-gradient px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                >
                  Próximo Passo
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="orange-gradient px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,107,0,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Diagnóstico
                      <Send size={20} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

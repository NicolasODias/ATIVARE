
import React, { useState, useMemo } from 'react';
import { Company, InternalQuestion, Feedback, FeedbackChannel } from '../types';
import { dataStore } from '../services/dataStore';
import { ChevronRight, ChevronLeft, Send, CheckCircle2, AlertCircle, LogOut, Award, ShieldCheck, Star, Mail, Calendar, MapPin, Plane } from 'lucide-react';

interface FeedbackFormProps {
  company: Company;
  initialChannel?: FeedbackChannel;
  onFinished: () => void;
  onBack?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ company, initialChannel, onFinished, onBack }) => {
  const [step, setStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  
  // O formulário é DINÂMICO baseado no que a empresa configurou como público
  const internalQuestions = useMemo(() => 
    dataStore.getInternalQuestions(company.id).filter(q => q.isPublic), 
  [company.id]);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    birthDate: '',
    howKnown: '',
    service: 0, 
    food: 0,    
    drinks: 0,  
    structure: 0, 
    profile: 'family' as any,
    customerType: 'local' as 'local' | 'tourist',
    observation: '',
    internalResponses: {} as any
  });
  const [submitted, setSubmitted] = useState(false);

  const isStep1Valid = 
    formData.name.trim() !== '' && 
    formData.surname.trim() !== '' && 
    formData.phone.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.birthDate !== '';

  const isStep2Valid = useMemo(() => {
    const coreRatingsDone = formData.service > 0 && formData.food > 0 && formData.drinks > 0 && formData.structure > 0;
    
    const requiredInternalDone = internalQuestions
      .filter(q => q.required)
      .every(q => {
        const resp = formData.internalResponses[q.id];
        if (q.type === 'TEXT') return resp && resp.trim() !== '';
        if (q.type === 'SCALE_5' || q.type === 'SCALE_10') return resp > 0;
        if (q.type === 'YES_NO') return resp !== undefined && resp !== null;
        return true;
      });

    return coreRatingsDone && requiredInternalDone;
  }, [formData, internalQuestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!isStep1Valid) {
        setShowValidation(true);
        return;
      }
      setStep(2);
      setShowValidation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!isStep2Valid) {
      setShowValidation(true);
      return;
    }

    // Salva o feedback com o trackingCode como CHAVE DE PROPRIEDADE (Ownership Key)
    dataStore.addFeedback({
      companyId: company.id,
      companyTrackingCode: company.trackingCode, // CORE: Roteamento definitivo
      customerId: '', 
      customerName: `${formData.name} ${formData.surname}`,
      customerPhone: formData.phone,
      customerBirthDate: formData.birthDate,
      howKnown: formData.howKnown,
      channel: initialChannel || 'DIRECT_LINK', // Define o canal
      scores: {
        service: formData.service,
        food: formData.food,
        drinks: formData.drinks,
        structure: formData.structure
      },
      internalResponses: formData.internalResponses,
      profile: formData.profile,
      customerType: formData.customerType,
      observation: formData.observation,
      email: formData.email
    });

    setSubmitted(true);
  };

  const handleInternalResponse = (qId: string, value: any) => {
    setFormData({
      ...formData,
      internalResponses: { ...formData.internalResponses, [qId]: value }
    });
  };

  const RatingDots = ({ value, onChange, label, max = 10, isError = false }: any) => {
    const [hover, setHover] = useState(0);
    const activeValue = hover || value;

    const getColorClass = (val: number) => {
      if (val === 0) return 'bg-transparent';
      if (val <= 3) return 'bg-red-500';
      if (val <= 6) return 'bg-yellow-400';
      return 'bg-emerald-500';
    };

    const activeColor = getColorClass(activeValue);

    return (
      <div className={`space-y-4 p-6 rounded-[2rem] transition-all border ${isError ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex justify-between items-center">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider">{label}</label>
          <span className={`text-xl font-black px-3 py-1 rounded-xl min-w-[3rem] text-center ${
            activeValue === 0 ? 'text-slate-300' :
            activeValue <= 3 ? 'text-red-600 bg-red-50' : 
            activeValue <= 6 ? 'text-yellow-600 bg-yellow-50' : 
            'text-emerald-600 bg-emerald-50'
          }`}>
            {activeValue === 0 ? '—' : activeValue}
          </span>
        </div>
        <div className="flex justify-between gap-1">
          {Array.from({ length: max }).map((_, i) => {
            const dotValue = i + 1;
            const isFilled = dotValue <= activeValue;
            return (
              <button
                key={dotValue}
                type="button"
                onMouseEnter={() => setHover(dotValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => {
                  onChange(dotValue);
                  setShowValidation(false);
                }}
                className={`
                  flex-1 h-10 rounded-full transition-all duration-200 border-2
                  ${isFilled && activeValue > 0 
                    ? `${activeColor} border-transparent scale-105` 
                    : 'bg-white border-slate-200 hover:border-slate-300'}
                `}
              />
            );
          })}
        </div>
        <div className="flex justify-between px-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
          <span>Ruim</span>
          <span>Excelente</span>
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#001529] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl p-16 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Feedback Enviado!</h2>
          <p className="text-slate-500 mb-10 font-medium text-sm leading-relaxed">Sua avaliação para <span className="text-primary font-bold">{company.name}</span> foi registrada com sucesso sob o protocolo <span className="font-mono text-primary font-bold">{company.trackingCode}</span>.</p>
          <button 
            onClick={onFinished}
            className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl uppercase tracking-widest text-xs"
          >
            Concluir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-inter pb-20">
      <header className="bg-white border-b border-slate-100 p-12 flex flex-col items-center sticky top-0 z-50">
        <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden -mt-24 mb-6 bg-white">
          <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{company.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">CÓDIGO: {company.trackingCode}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-6 mt-10">
        <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white">
          <div className="h-2 w-full bg-slate-50">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${step * 50}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-12">
            {step === 1 ? (
              <div className="space-y-10 animate-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900">Olá!</h2>
                  <p className="text-slate-400 font-medium">Sua experiência é fundamental para evoluirmos.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nome *</label>
                    <input 
                      required
                      type="text" 
                      className={`w-full p-5 bg-slate-50 border rounded-3xl outline-none focus:border-primary font-bold text-slate-900 transition-all ${showValidation && !formData.name ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100'}`}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sobrenome *</label>
                    <input 
                      required
                      type="text" 
                      className={`w-full p-5 bg-slate-50 border rounded-3xl outline-none focus:border-primary font-bold text-slate-900 transition-all ${showValidation && !formData.surname ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100'}`}
                      value={formData.surname}
                      onChange={(e) => setFormData({...formData, surname: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">WhatsApp *</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      className={`w-full p-5 bg-slate-50 border rounded-3xl outline-none focus:border-primary font-bold text-slate-900 transition-all ${showValidation && !formData.phone ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100'}`}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data de Nascimento *</label>
                    <div className="relative">
                      <input 
                        required
                        type="date" 
                        className={`w-full p-5 bg-slate-50 border rounded-3xl outline-none focus:border-primary font-bold text-slate-900 transition-all ${showValidation && !formData.birthDate ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100'}`}
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">E-mail de Contato *</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      required
                      type="email" 
                      placeholder="seu@email.com"
                      className={`w-full pl-14 p-5 bg-slate-50 border rounded-3xl outline-none focus:border-primary font-bold text-slate-900 transition-all ${showValidation && !formData.email ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100'}`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Qual a sua origem?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, customerType: 'local'})}
                      className={`p-5 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${
                        formData.customerType === 'local' 
                          ? 'bg-primary border-primary text-white shadow-xl' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                      Morador Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, customerType: 'tourist'})}
                      className={`p-5 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${
                        formData.customerType === 'tourist' 
                          ? 'bg-primary border-primary text-white shadow-xl' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <Plane className="w-5 h-5" />
                      Turista / Visitante
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Como você se identifica?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'family', label: 'Em Família' },
                      { id: 'friends', label: 'Com Amigos' },
                      { id: 'couple', label: 'Em Casal' },
                      { id: 'kids', label: 'Com Crianças' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({...formData, profile: p.id as any})}
                        className={`p-5 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                          formData.profile === p.id 
                            ? 'bg-primary border-primary text-white shadow-xl' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button 
                    type="submit"
                    className={`w-full py-6 text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs ${isStep1Valid ? 'bg-primary hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
                  >
                    Próxima Etapa <ChevronRight className="w-5 h-5" />
                  </button>

                  {onBack && (
                    <button 
                      type="button"
                      onClick={onBack}
                      className="w-full py-4 text-slate-300 font-black text-[9px] uppercase tracking-[0.3em] hover:text-primary transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Cancelar Avaliação
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in slide-in-from-right duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-primary" />
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Avaliação Geral</h3>
                  </div>
                  <RatingDots 
                    label="Qualidade do Serviço" 
                    value={formData.service} 
                    onChange={(v: number) => setFormData({...formData, service: v})} 
                    isError={showValidation && formData.service === 0}
                  />
                  <RatingDots 
                    label="Qualidade da Comida" 
                    value={formData.food} 
                    onChange={(v: number) => setFormData({...formData, food: v})} 
                    isError={showValidation && formData.food === 0}
                  />
                  <RatingDots 
                    label="Qualidade das Bebidas" 
                    value={formData.drinks} 
                    onChange={(v: number) => setFormData({...formData, drinks: v})} 
                    isError={showValidation && formData.drinks === 0}
                  />
                  <RatingDots 
                    label="Estrutura e Ambiente" 
                    value={formData.structure} 
                    onChange={(v: number) => setFormData({...formData, structure: v})} 
                    isError={showValidation && formData.structure === 0}
                  />
                </div>

                {/* Perguntas DINÂMICAS do Negócio via Tracking Code */}
                {internalQuestions.length > 0 && (
                  <div className="space-y-10 pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Exclusivo: {company.name}</h3>
                    </div>
                    {internalQuestions.map(q => {
                      const resp = formData.internalResponses[q.id];
                      const isMissing = q.required && (resp === undefined || resp === null || resp === 0 || (typeof resp === 'string' && resp.trim() === ''));
                      
                      return (
                        <div key={q.id} className="space-y-4">
                          {q.type === 'YES_NO' && (
                            <div className={`space-y-6 p-8 rounded-[2rem] transition-all border ${showValidation && isMissing ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
                              <label className="text-xs font-black text-slate-800 uppercase tracking-tight leading-relaxed">{q.text} {q.required && '*'}</label>
                              <div className="flex gap-4">
                                {['SIM', 'NÃO'].map(opt => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleInternalResponse(q.id, opt)}
                                    className={`flex-1 py-5 rounded-[1.5rem] border-2 font-black text-xs transition-all uppercase tracking-widest ${
                                      formData.internalResponses[q.id] === opt 
                                        ? 'bg-primary border-primary text-white shadow-xl' 
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {(q.type === 'SCALE_5' || q.type === 'SCALE_10') && (
                            <RatingDots 
                              max={q.type === 'SCALE_5' ? 5 : 10}
                              label={q.text + (q.required ? ' *' : '')}
                              value={formData.internalResponses[q.id] || 0} 
                              onChange={(v: number) => handleInternalResponse(q.id, v)} 
                              isError={showValidation && isMissing}
                            />
                          )}

                          {q.type === 'TEXT' && (
                            <div className={`space-y-4 p-8 rounded-[2rem] transition-all border ${showValidation && isMissing ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
                               <label className="text-xs font-black text-slate-800 uppercase tracking-tight">{q.text} {q.required && '*'}</label>
                              <textarea 
                                required={q.required}
                                className={`w-full h-32 p-6 bg-white border rounded-3xl outline-none focus:border-primary font-medium text-sm text-slate-900 shadow-inner ${showValidation && isMissing ? 'border-red-300' : 'border-slate-200'}`}
                                placeholder="Sua mensagem..."
                                value={formData.internalResponses[q.id] || ''}
                                onChange={(e) => handleInternalResponse(q.id, e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-4 pt-10 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Observações Finais</label>
                  <textarea 
                    className="w-full h-40 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:border-primary font-medium text-sm text-slate-900 shadow-inner"
                    placeholder="Algo que gostaria de destacar positivamente ou sugerir melhoria?"
                    value={formData.observation}
                    onChange={(e) => setFormData({...formData, observation: e.target.value})}
                  />
                </div>

                {showValidation && !isStep2Valid && (
                  <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in slide-in-from-top">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="text-xs font-black uppercase tracking-wider">Preencha todos os campos obrigatórios para continuar.</p>
                  </div>
                )}

                <div className="flex gap-6">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-400 font-black rounded-3xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Anterior</button>
                  <button 
                    type="submit" 
                    className={`flex-[2] py-6 text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs ${isStep2Valid ? 'bg-primary shadow-primary/30 hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
                  >
                    Finalizar Avaliação <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;

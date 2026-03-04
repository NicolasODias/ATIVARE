
import React, { useState, useMemo } from 'react';
import { Company, PlanType, AccountStatus } from '../types';
import { dataStore } from '../services/dataStore';
import { 
  CreditCard, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowUpRight, 
  Users, 
  MessageSquare, 
  ClipboardList,
  Clock,
  ChevronRight
} from 'lucide-react';

interface AccountBillingProps {
  companyId: string;
}

const AccountBilling: React.FC<AccountBillingProps> = ({ companyId }) => {
  const company = dataStore.getCompany(companyId);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const feedbacks = useMemo(() => dataStore.getFeedbacks(companyId), [companyId]);
  const cases = useMemo(() => dataStore.getCases(companyId), [companyId]);
  const companyUsers = useMemo(() => dataStore.getCompanyUsers(companyId), [companyId]);

  if (!company) return null;

  const currentMonthEvaluations = feedbacks.filter(f => {
    const date = new Date(f.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const openCasesCount = cases.filter(c => c.status !== 'RESOLVED').length;

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500';
      case 'TRIAL': return 'bg-amber-500';
      case 'SUSPENDED': return 'bg-red-500';
      case 'EXPIRED': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const ProgressBar = ({ label, current, max, icon: Icon }: any) => {
    const percentage = Math.min(100, (current / max) * 100);
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Icon className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
              <p className="text-sm font-black text-slate-900">{current} <span className="text-slate-300 font-bold">/ {max === Infinity ? '∞' : max}</span></p>
            </div>
          </div>
          <span className={`text-[10px] font-black ${percentage > 90 ? 'text-red-500' : 'text-slate-400'}`}>{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Account Info */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-primary/5 text-primary rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
              Informações da Conta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><Zap className="w-6 h-6" /></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Plano Atual</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Ativare {company.plan}</p>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                 <div className={`w-3 h-3 rounded-full ${getStatusColor(company.status)} animate-pulse`}></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-widest">{company.status}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3 text-slate-400">
                     <FileText className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-wider">CNPJ Registrado</span>
                  </div>
                  <span className="text-sm font-black text-slate-700">{company.cnpj}</span>
               </div>
               <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Calendar className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-wider">Início da Conta</span>
                  </div>
                  <span className="text-sm font-black text-slate-700">{new Date(company.startDate || company.trialEndDate!).toLocaleDateString('pt-BR')}</span>
               </div>
               <div className="flex justify-between items-center py-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <CreditCard className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-wider">Próximo Faturamento</span>
                  </div>
                  <span className="text-sm font-black text-primary">{company.nextBillingDate ? new Date(company.nextBillingDate).toLocaleDateString('pt-BR') : 'Sem faturamento pendente'}</span>
               </div>
            </div>
          </section>

          {/* Usage Metrics */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-primary/5 text-primary rounded-xl"><Clock className="w-5 h-5" /></div>
              Uso da Plataforma
            </h3>

            <div className="space-y-10">
              <ProgressBar 
                label="Avaliações Mensais" 
                current={currentMonthEvaluations} 
                max={company.maxEvaluations} 
                icon={MessageSquare} 
              />
              <ProgressBar 
                label="Usuários Ativos" 
                current={companyUsers.length} 
                max={company.maxUsers} 
                icon={Users} 
              />
              <ProgressBar 
                label="Casos em Aberto" 
                current={openCasesCount} 
                max={Infinity} 
                icon={ClipboardList} 
              />
            </div>
          </section>
        </div>

        {/* Upgrade Card */}
        <div className="lg:col-span-5">
           <div className="bg-gradient-to-br from-[#0047a7] to-[#002e6b] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
              <div className="relative z-10 space-y-6">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <Zap className="w-8 h-8 text-accent" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black mb-2">Potencialize seu Atendimento</h3>
                    <p className="text-white/70 font-medium">Aumente seus limites de usuários e avaliações e tenha acesso a BI avançado.</p>
                 </div>
                 
                 <ul className="space-y-4">
                    {[
                      'Suporte Prioritário 24/7',
                      'Dashboard BI Completo',
                      'Usuários Ilimitados (Enterprise)',
                      'API Pública e Webhooks',
                      'Ranking Regional'
                    ].map(feat => (
                      <li key={feat} className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5 text-accent" /> {feat}
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="relative z-10 pt-10">
                 <button 
                   onClick={() => setShowUpgradeModal(true)}
                   className="w-full py-6 bg-accent hover:bg-white hover:text-primary transition-all text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                 >
                   Upgrade de Plano <ArrowUpRight className="w-5 h-5" />
                 </button>
                 <p className="text-center text-white/40 text-[9px] font-bold uppercase mt-6 tracking-widest">Contrato anual com 20% de desconto</p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
           </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}></div>
          <div className="bg-white rounded-[3.5rem] w-full max-w-5xl p-12 relative z-10 shadow-2xl border border-white animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 transition-all"><X className="w-8 h-8" /></button>
            
            <div className="text-center mb-12">
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Escolha o plano ideal</h2>
               <p className="text-slate-400 font-medium mt-2">Expanda as fronteiras da experiência do seu negócio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* TRIAL / FREE */}
               <div className="p-8 rounded-[3rem] border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Degustação</h4>
                    <p className="text-2xl font-black text-slate-900 mb-6">Grátis</p>
                    <ul className="space-y-4 mb-10">
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-300" /> 50 Avaliações / mês</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-300" /> 3 Usuários</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-300" /> Gestão de Casos</li>
                    </ul>
                  </div>
                  <button disabled className="w-full py-4 bg-slate-200 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest">Plano Atual</button>
               </div>

               {/* PRO */}
               <div className="p-8 rounded-[3rem] border-4 border-primary bg-white shadow-2xl relative flex flex-col justify-between transform scale-105">
                  <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-accent text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Mais Popular</div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-2">Profissional</h4>
                    <p className="text-4xl font-black text-slate-900 mb-2">R$ 199<span className="text-sm font-bold text-slate-400">/mês</span></p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase mb-8">Faturado anualmente</p>
                    <ul className="space-y-4 mb-10">
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-primary" /> 500 Avaliações / mês</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-primary" /> 10 Usuários</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-primary" /> Dashboards Avançados</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-600"><CheckCircle2 className="w-4 h-4 text-primary" /> Relatórios em PDF</li>
                    </ul>
                  </div>
                  <button className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Assinar Agora</button>
               </div>

               {/* ENTERPRISE */}
               <div className="p-8 rounded-[3rem] border border-slate-100 bg-slate-900 text-white flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Empresarial</h4>
                    <p className="text-2xl font-black mb-6">Sob Consulta</p>
                    <ul className="space-y-4 mb-10">
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-400"><CheckCircle2 className="w-4 h-4 text-accent" /> Avaliações Ilimitadas</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-400"><CheckCircle2 className="w-4 h-4 text-accent" /> Usuários Ilimitados</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-400"><CheckCircle2 className="w-4 h-4 text-accent" /> API & Integrações</li>
                       <li className="flex items-center gap-2 text-xs font-bold text-slate-400"><CheckCircle2 className="w-4 h-4 text-accent" /> Gerente de Contas</li>
                    </ul>
                  </div>
                  <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Falar com Consultor</button>
               </div>
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm"><AlertCircle className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Precisa de um plano customizado para franquias?</p>
                    <p className="text-xs font-medium text-slate-400">Oferecemos condições especiais para redes acima de 10 unidades.</p>
                  </div>
               </div>
               <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline">
                  Ver Soluções para Franquias <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountBilling;


import React, { useState, useMemo, useEffect, useRef } from 'react';
import { dataStore } from '../services/dataStore';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Filter, 
  PieChart, 
  TrendingUp, 
  BrainCircuit, 
  Zap, 
  Smile, 
  Frown, 
  Clock, 
  Flame,
  AlertTriangle,
  ChevronRight,
  Info,
  Sparkles,
  FileText,
  CheckCircle2, 
  ListChecks,
  Activity,
  ArrowRight,
  Download,
  Loader2,
  X,
  Mail,
  Building,
  Send,
  MessageSquare,
  Bot
} from 'lucide-react';

interface AIInsight {
  diagnosis: string;
  strengths: string[];
  improvements: string[];
  actionPlan: string[];
  actionableSuggestions: {
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface BIProps {
  companyId: string;
}

const BI: React.FC<BIProps> = ({ companyId }) => {
  const [timeRange, setTimeRange] = useState<number>(30);
  const [evalType, setEvalType] = useState<string>('ALL');
  
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const biData = useMemo(() => dataStore.getBIData(companyId, timeRange), [companyId, timeRange]);
  const company = useMemo(() => dataStore.getCompany(companyId), [companyId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const generateAIInsights = async () => {
    if (!biData || loadingAI) return;
    
    setLoadingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this customer experience data for the business "${company?.name}" and return strategic insights in JSON.
        Data Summary:
        - Total Evaluations: ${biData.rawSummary.totalEvaluations}
        - Detractors: ${biData.rawSummary.detractorsCount}
        - Promoters: ${biData.rawSummary.promotersCount}
        - Category Averages (1-10): Service: ${biData.rawSummary.averageScores.service}, Food: ${biData.rawSummary.averageScores.food}, Drinks: ${biData.rawSummary.averageScores.drinks}, Structure: ${biData.rawSummary.averageScores.structure}
        - Recent Comments: ${biData.rawSummary.recentComments.join(' | ')}
        `,
        config: {
          systemInstruction: "You are a senior business consultant specialized in customer experience. Provide a professional diagnosis and actionable steps. Use Portuguese (PT-BR).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionableSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  },
                  required: ["title", "description", "impact"]
                }
              },
              actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["diagnosis", "strengths", "improvements", "actionableSuggestions", "actionPlan"]
          }
        }
      });

      const insights = JSON.parse(response.text) as AIInsight;
      setAiInsights(insights);
      setChecklist([]);
      
      // Initialize chat with a welcome message
      setChatMessages([{
        role: 'model',
        text: `Olá! Gere o diagnóstico para o ${company?.name}. Como posso te ajudar a interpretar esses dados ou traçar novas estratégias hoje?`
      }]);
    } catch (error) {
      console.error("AI Insight Error:", error);
      alert("Erro ao gerar insights. Verifique sua conexão e tente novamente.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userText = userInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `Contexto do Negócio (${company?.name}): NPS ${biData.prediction}, ${biData.rawSummary.totalEvaluations} avaliações. Minha dúvida ou comentário: ${userText}` }] }
        ],
        config: {
          systemInstruction: `Você é o Especialista Ativare. Sua missão é dar suporte estratégico ultrarresumido e claro.

          REGRAS CRÍTICAS DE RESPOSTA:
          1. SUMARIZAÇÃO MÁXIMA: Vá direto ao ponto. Elimine introduções longas ou saudações repetitivas.
          2. ESTRUTURA EM PARÁGRAFOS: Divida sua resposta em 2 ou 3 parágrafos curtos. Nunca mande um bloco único de texto.
          3. ABORDAGEM CONSULTIVA: Primeiro, faça 1 pergunta curta para validar o cenário. Depois, dê a sugestão resumida em tópicos se necessário.
          4. LINGUAGEM DIRETA: Use termos simples, mas profissionais. Foque nos dados de NPS (${biData.prediction}).
          
          FORMATO ESPERADO:
          Parágrafo 1: Análise breve da dúvida baseada no NPS.
          Parágrafo 2: Pergunta(s) de diagnóstico para entender a dor.
          Parágrafo 3: Sugestão prática final (resumida).`,
        }
      });

      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Desculpe, tive um problema ao processar sua resposta." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Erro ao conectar com a inteligência artificial. Tente novamente em instantes." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChecklist = (item: string) => {
    setChecklist(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  if (!biData) return null;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 relative">
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="bg-transparent text-sm font-bold text-slate-700 outline-none">
              <option value={7}>Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>
         </div>
         <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={evalType} onChange={(e) => setEvalType(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none">
               <option value="ALL">Todas Avaliações</option>
               <option value="DETRACTOR">Apenas Detratores</option>
               <option value="PROMOTER">Apenas Promotores</option>
            </select>
         </div>
         <div className="ml-auto flex gap-3">
            <button 
               onClick={generateAIInsights} 
               disabled={loadingAI}
               className="px-6 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
            >
               {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <><BrainCircuit className="w-4 h-4 text-accent" /> Gerar Diagnóstico IA</>}
            </button>
         </div>
      </div>

      {/* --- AI DIAGNOSIS AT THE TOP --- */}
      {aiInsights && (
        <section className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl space-y-10 animate-in zoom-in duration-500 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent rounded-2xl shadow-lg shadow-accent/20"><BrainCircuit className="w-8 h-8 text-white" /></div>
              <div>
                <h3 className="text-2xl font-black">Diagnóstico da Estratégia</h3>
                <p className="text-white/40 text-xs font-black uppercase tracking-widest">Análise Consultiva Gerada por IA</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-accent" /> Consultar Especialista IA
              </button>
              <button onClick={() => setAiInsights(null)} className="text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 italic text-lg text-white/80 leading-relaxed font-medium">
              "{aiInsights.diagnosis}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2"><Smile className="w-4 h-4" /> Pontos Fortes</h4>
                <ul className="space-y-3">
                  {aiInsights.strengths.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-red-400 tracking-widest flex items-center gap-2"><Frown className="w-4 h-4" /> A Corrigir</h4>
                <ul className="space-y-3">
                  {aiInsights.improvements.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/10">
              <h4 className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-2"><ListChecks className="w-4 h-4" /> Plano de Ação Recomendado</h4>
              <div className="grid grid-cols-1 gap-4">
                {aiInsights.actionableSuggestions.map((s, i) => (
                  <div key={i} className={`p-6 rounded-3xl border flex items-start justify-between group transition-all ${checklist.includes(s.title) ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex gap-4">
                      <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checklist.includes(s.title) ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                        {checklist.includes(s.title) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className={`text-sm font-black transition-all ${checklist.includes(s.title) ? 'text-emerald-400 line-through' : 'text-white'}`}>{s.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${s.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{s.impact} IMPACTO</span>
                        </div>
                        <p className={`text-xs font-medium leading-relaxed transition-all ${checklist.includes(s.title) ? 'text-white/20' : 'text-white/50'}`}>{s.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        </section>
      )}

      {/* --- GRID SCROLLS TO THE BOTTOM --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-primary" /> Tendência de Score
               </h3>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={biData.trendData}>
                        <defs>
                           <linearGradient id="colorScoreBI" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0047a7" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#0047a7" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="score" stroke="#0047a7" strokeWidth={4} fillOpacity={1} fill="url(#colorScoreBI)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </section>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
               <h3 className="text-lg font-black text-slate-900">Resumo Operacional</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase"><Activity className="w-4 h-4" /> Score Geral</div>
                     <span className="text-lg font-black text-primary">{biData.prediction} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase"><Smile className="w-4 h-4" /> Promotores</div>
                     <span className="text-lg font-black text-emerald-500">{biData.rawSummary.promotersCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase"><Frown className="w-4 h-4" /> Detratores</div>
                     <span className="text-lg font-black text-red-500">{biData.rawSummary.detractorsCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                     <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase"><FileText className="w-4 h-4" /> Total Avaliações</div>
                     <span className="text-lg font-black text-slate-800">{biData.rawSummary.totalEvaluations}</span>
                  </div>
               </div>
            </section>

            <section className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
               <h4 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Averages por Categoria</h4>
               <div className="space-y-4">
                  {[
                    { label: 'Serviço', val: biData.rawSummary.averageScores.service },
                    { label: 'Comida', val: biData.rawSummary.averageScores.food },
                    { label: 'Bebidas', val: biData.rawSummary.averageScores.drinks },
                    { label: 'Estrutura', val: biData.rawSummary.averageScores.structure }
                  ].map(cat => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>{cat.label}</span>
                        <span>{cat.val}/10</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${cat.val * 10}%` }}></div>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>
      </div>

      {/* --- FLOATING AI CHAT --- */}
      {aiInsights && (
        <>
          {/* Chat Bubble Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[99]"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <div className="relative"><Bot className="w-8 h-8" /><span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-slate-900 animate-pulse"></span></div>}
          </button>

          {/* Chat Window */}
          {isChatOpen && (
            <div className="fixed bottom-28 right-8 w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300 z-[99]">
              {/* Header */}
              <div className="bg-slate-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <BrainCircuit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-black uppercase tracking-tight">Especialista Ativare</h4>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online agora
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/20 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none whitespace-pre-wrap'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
                <div className="relative">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="O que você gostaria de analisar hoje?"
                    className="w-full pl-6 pr-14 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-sm transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-center text-[8px] font-bold text-slate-300 uppercase mt-3 tracking-widest">Ativare AI Assistant • Consultoria Estratégica</p>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BI;

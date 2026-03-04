
import React, { useState } from 'react';
import { dataStore } from '../services/dataStore';
import { InternalQuestion, InternalQuestionType } from '../types';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Type, 
  CheckSquare, 
  ListOrdered, 
  MessageSquare,
  Eye,
  EyeOff,
  GripVertical,
  AlertCircle
} from 'lucide-react';

interface InternalFormConfigProps {
  companyId: string;
}

const InternalFormConfig: React.FC<InternalFormConfigProps> = ({ companyId }) => {
  const [questions, setQuestions] = useState<InternalQuestion[]>(dataStore.getInternalQuestions(companyId, false));
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Novo estado para a pergunta sendo criada
  const [newQuestion, setNewQuestion] = useState<Partial<InternalQuestion>>({
    text: '',
    type: 'SCALE_10',
    required: true,
    active: true,
    isPublic: false
  });

  const handleAddQuestion = () => {
    if (!newQuestion.text) return;

    const question: InternalQuestion = {
      id: `q-${Date.now()}`,
      companyId,
      text: newQuestion.text,
      type: newQuestion.type as InternalQuestionType,
      required: !!newQuestion.required,
      active: true,
      isPublic: !!newQuestion.isPublic,
      order: questions.length + 1
    };

    dataStore.saveInternalQuestion(question);
    setQuestions([...questions, question]);
    setIsModalOpen(false);
    setNewQuestion({
      text: '',
      type: 'SCALE_10',
      required: true,
      active: true,
      isPublic: false
    });
  };

  const handleDelete = (id: string) => {
    dataStore.deleteInternalQuestion(id);
    setQuestions(questions.filter(q => q.id !== id));
  };

  const toggleActive = (q: InternalQuestion) => {
    const updated = { ...q, active: !q.active };
    dataStore.saveInternalQuestion(updated);
    setQuestions(questions.map(item => item.id === q.id ? updated : item));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Customização do Formulário</h2>
          <p className="text-slate-400 font-medium">Crie perguntas personalizadas para coletar dados estratégicos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" /> Adicionar Pergunta
        </button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Type className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhuma pergunta personalizada configurada.</p>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={q.id} className={`bg-white p-6 rounded-[2rem] border transition-all flex items-center gap-6 ${q.active ? 'border-slate-100' : 'border-slate-50 opacity-60'}`}>
              <div className="text-slate-300 cursor-grab"><GripVertical className="w-5 h-5" /></div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-black uppercase tracking-tighter">{q.type}</span>
                  {q.isPublic ? (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500"><Eye className="w-3 h-3" /> Público</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-500"><EyeOff className="w-3 h-3" /> Interno (Staff)</span>
                  )}
                  {q.required && <span className="text-[9px] font-black uppercase text-red-400">Obrigatório</span>}
                </div>
                <p className="text-sm font-bold text-slate-800">{q.text}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleActive(q)}
                  className={`p-3 rounded-xl transition-all ${q.active ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}
                  title={q.active ? 'Desativar' : 'Ativar'}
                >
                  <CheckSquare className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Side Modal for Adding Questions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Nova Pergunta</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enunciado da Pergunta</label>
                <textarea 
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Ex: Como você avalia a apresentação dos pratos?"
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary font-bold text-slate-900"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo de Resposta</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'SCALE_10', label: 'Escala 1-10', icon: ListOrdered },
                    { id: 'SCALE_5', label: 'Escala 1-5', icon: ListOrdered },
                    { id: 'YES_NO', label: 'Sim ou Não', icon: CheckSquare },
                    { id: 'TEXT', label: 'Texto Aberto', icon: MessageSquare },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setNewQuestion({...newQuestion, type: t.id as InternalQuestionType})}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newQuestion.type === t.id ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      <t.icon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Resposta Obrigatória</p>
                      <p className="text-[10px] text-slate-400 font-medium">Impede o envio sem resposta.</p>
                    </div>
                    <button 
                      onClick={() => setNewQuestion({...newQuestion, required: !newQuestion.required})}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${newQuestion.required ? 'bg-primary' : 'bg-slate-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${newQuestion.required ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Visibilidade Pública</p>
                      <p className="text-[10px] text-slate-400 font-medium">Aparece para o cliente avaliar.</p>
                    </div>
                    <button 
                      onClick={() => setNewQuestion({...newQuestion, isPublic: !newQuestion.isPublic})}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${newQuestion.isPublic ? 'bg-primary' : 'bg-slate-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${newQuestion.isPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>

                 {!newQuestion.isPublic && (
                   <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                      <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">
                        Perguntas internas não afetam o score público e devem ser respondidas pela sua equipe ao analisar cada avaliação.
                      </p>
                   </div>
                 )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100">
              <button 
                onClick={handleAddQuestion}
                disabled={!newQuestion.text}
                className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Criar Pergunta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalFormConfig;

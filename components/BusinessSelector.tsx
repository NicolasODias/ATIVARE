
import React, { useState, useMemo } from 'react';
import { Company, User, UserRole } from '../types';
import { dataStore } from '../services/dataStore';
import { Search, Building, ChevronRight, ShieldCheck, MapPin, Hash, Star, Zap, Globe } from 'lucide-react';

interface BusinessSelectorProps {
  user: User;
  onSelect: (companyId: string) => void;
}

const BusinessSelector: React.FC<BusinessSelectorProps> = ({ user, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const companies = useMemo(() => {
    if (user.role === UserRole.ADM_MASTER) return dataStore.getAllCompanies();
    if (user.role === UserRole.GUARDIAN) {
      return dataStore.getAllCompanies().filter(c => 
        user.linkedCompanyIds?.includes(c.id) || c.isGuardianConsultancy
      );
    }
    return [];
  }, [user]);

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.trackingCode.includes(searchTerm.toUpperCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-12 px-6 animate-in fade-in duration-700">
      <div className="max-w-4xl w-full space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-widest">
             <ShieldCheck className="w-3 h-3" /> Modo {user.role === UserRole.ADM_MASTER ? 'Administrador Master' : 'Consultor Guardião'}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Selecione uma unidade <br/><span className="text-primary italic">para gerenciar</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Você tem acesso a {companies.length} estabelecimentos. Escolha um para visualizar dados e gerenciar feedbacks.
          </p>
        </div>

        <div className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-xl focus-within:border-primary transition-all flex items-center gap-4">
           <Search className="w-6 h-6 text-slate-300 ml-4" />
           <input 
             type="text" 
             placeholder="Buscar por nome, código ou cidade..."
             className="flex-1 py-4 bg-transparent outline-none font-bold text-lg text-slate-900 placeholder:text-slate-200"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <Building className="w-12 h-12 text-slate-100 mx-auto mb-4" />
               <p className="text-slate-300 font-black uppercase text-xs tracking-widest">Nenhuma empresa encontrada.</p>
            </div>
          ) : (
            filtered.map(comp => (
              <button 
                key={comp.id}
                onClick={() => onSelect(comp.id)}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:bg-primary/5 transition-colors">
                      {comp.logo ? (
                        <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-6 h-6 text-slate-200" />
                      )}
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-800 text-base leading-tight line-clamp-1">{comp.name}</h3>
                        {comp.isGuardianConsultancy && <span title="Consultoria Ativa"><ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /></span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                         <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {comp.city}</span>
                         <span className="flex items-center gap-1 text-primary"><Hash className="w-3 h-3" /> {comp.trackingCode}</span>
                      </div>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="flex justify-center gap-8 pt-6 border-t border-slate-100">
           <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso de Alta Performance</span>
           </div>
           <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Intelligence Ativo</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSelector;

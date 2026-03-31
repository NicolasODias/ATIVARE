
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Company } from '../types';
import { NAV_ITEMS, COLORS } from '../constants';
import { dataStore } from '../services/dataStore';
import { LogOut, ChevronDown, Bell, Search, User as UserIcon, Settings, Users, UserCircle, DollarSign, BarChart3, Building, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  hasDetractorAlert?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  selectedCompanyId, 
  setSelectedCompanyId,
  hasDetractorAlert,
  children 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCompany = dataStore.getCompany(selectedCompanyId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNav = NAV_ITEMS.filter(item => {
    const roleMatch = item.roles.includes(user.role);
    const staffRoleMatch = !item.staffRoles || (user.staffRole && item.staffRoles.includes(user.staffRole)) || user.role === UserRole.ADM_MASTER || user.role === UserRole.GUARDIAN;
    return roleMatch && staffRoleMatch;
  });

  const getAccessibleCompanies = () => {
    if (user.role === UserRole.ADM_MASTER) return dataStore.getAllCompanies();
    if (user.role === UserRole.GUARDIAN) {
      // Guardião vê empresas vinculadas OU empresas com Consultoria Guardiã ativa
      return dataStore.getAllCompanies().filter(c => 
        user.linkedCompanyIds?.includes(c.id) || c.isGuardianConsultancy
      );
    }
    return selectedCompany ? [selectedCompany] : [];
  };

  const accessibleCompanies = getAccessibleCompanies();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="w-64 bg-[#002e6b] text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white italic">A</div>
          <span className="text-xl font-bold tracking-tight">Ativare <span className="text-slate-300 font-light text-sm block">Experience</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNav.map(item => {
            const isMasterDash = item.id === 'dashboard' && user.role === UserRole.ADM_MASTER;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  {isMasterDash ? <DollarSign className="w-5 h-5" /> : item.icon}
                  {item.id === 'cases' && hasDetractorAlert && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </div>
                <span className="font-medium">{isMasterDash ? 'Relatórios ADM' : item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden text-slate-900">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-50">
          <div className="flex items-center space-x-4">
            {(user.role === UserRole.ADM_MASTER || user.role === UserRole.GUARDIAN) ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-all">
                  <span className="text-sm font-semibold text-slate-700">{selectedCompany?.name || 'Selecionar Unidade'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl hidden group-hover:block z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    {user.role === UserRole.ADM_MASTER ? 'Todos os Estabelecimentos' : 'Unidades Acessíveis'}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {accessibleCompanies.length === 0 && <div className="p-4 text-xs font-bold text-slate-400 uppercase">Nenhum acesso vinculado</div>}
                    {accessibleCompanies.map(comp => (
                      <button
                        key={comp.id}
                        onClick={() => setSelectedCompanyId(comp.id)}
                        className={`w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-bold transition-all flex items-center justify-between border-b border-slate-50 last:border-0 ${selectedCompanyId === comp.id ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Building className={`w-4 h-4 ${selectedCompanyId === comp.id ? 'text-primary' : 'text-slate-300'}`} /> 
                          <span className="truncate max-w-[160px]">{comp.name}</span>
                        </div>
                        {comp.isGuardianConsultancy && (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" title="Consultoria Guardiã Ativa" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">{selectedCompany?.name}</h2>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative" onClick={() => setActiveTab('cases')}>
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-all" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-700 leading-tight">{user.name}</p>
                  <p className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded mt-1 uppercase tracking-wider">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0047a7&color=fff`} alt="Avatar" />
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                   <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">E-mail de Acesso</p>
                      <p className="text-sm font-bold text-slate-700">{user.email}</p>
                   </div>
                   <div className="p-2">
                      <button onClick={() => { setActiveTab('my_profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-600 transition-all">
                        <UserCircle className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-bold">Meu Perfil</span>
                      </button>
                   </div>
                   <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-red-500 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Sair do Sistema</span>
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">Visão Geral</p>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' && user.role === UserRole.ADM_MASTER ? 'Relatórios de Gestão ADM' : 
                   NAV_ITEMS.find(i => i.id === activeTab)?.label}
                </h1>
              </div>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

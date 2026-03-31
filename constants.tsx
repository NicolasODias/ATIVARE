
import React from 'react';
import { Company, User, UserRole } from './types';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  ClipboardList, 
  Globe,
  PieChart,
  FormInput,
  Target,
  Settings,
  Store,
  UserCircle,
  FileSearch,
  UserPlus,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  UserPlus2
} from 'lucide-react';

export const COLORS = {
  primary: '#0047a7',
  white: '#ffffff',
  accent: '#ff6800',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

export const MOCK_COMPANIES: Company[] = [
  { 
    id: 'c-test', 
    trackingCode: 'BELLA1', 
    name: 'Pizzaria Bella Itália', 
    description: 'Tradicional pizzaria em Poços de Caldas, focada em excelência e massa artesanal.', 
    category: 'Pizzaria', 
    city: 'Poços de Caldas - MG', 
    logo: 'https://picsum.photos/seed/pizza-test/200', 
    experienceScore: 0, 
    phone: '(35) 3721-0000', 
    email: 'contato@bellaitailia.com', 
    address: 'Centro, Poços de Caldas - MG',
    monthlyValue: 199,
    implementationValue: 500,
    plan: 'PRO',
    status: 'ACTIVE',
    maxEvaluations: 500,
    maxUsers: 10,
    employees: '11-50',
    cnpj: '12.345.678/0001-90',
    startDate: '2025-01-01T10:00:00Z'
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u-test', name: 'Ricardo Dono', email: 'ativare@teste.com', password: '12345678', role: UserRole.BUSINESS, staffRole: 'ADMIN', companyId: 'c-test', isOnboarded: true, jobTitle: 'Dono' },
  { id: 'u1', name: 'Admin Ativare', email: 'master@ativare.com', password: '123', role: UserRole.ADM_MASTER, isOnboarded: true },
  { id: 'u2', name: 'Guardião Exemplo', email: 'guardiao@ativare.com', password: '123', role: UserRole.GUARDIAN, isOnboarded: true },
  { id: 'u-tulio', name: 'Tulio Bacellar', email: 'tuliobacellar9@ativareexp.com', password: 'Danda88@', role: UserRole.ADM_MASTER, isOnboarded: true },
  { id: 'u-vendas', name: 'Vendas Ativare', email: 'vendas@ativareexp.com', password: 'Vend@s', role: UserRole.ADM_MASTER, isOnboarded: true }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, roles: [UserRole.ADM_MASTER, UserRole.BUSINESS, UserRole.USER, UserRole.GUARDIAN] },
  { id: 'master_clients', label: 'Novo Cliente', icon: <UserPlus2 className="w-5 h-5" />, roles: [UserRole.ADM_MASTER] },
  { id: 'master_leads', label: 'CRM Master', icon: <HeartHandshake className="w-5 h-5" />, roles: [UserRole.ADM_MASTER] },
  { id: 'master_admin_console', label: 'Console ADM', icon: <ShieldCheck className="w-5 h-5" />, roles: [UserRole.ADM_MASTER] },
  { id: 'internal_metrics', label: 'Métricas Internas', icon: <Target className="w-5 h-5" />, roles: [UserRole.BUSINESS], staffRoles: ['ADMIN'] },
  { id: 'cases', label: 'Gestão de Casos', icon: <ClipboardList className="w-5 h-5" />, roles: [UserRole.ADM_MASTER, UserRole.BUSINESS, UserRole.USER, UserRole.GUARDIAN], staffRoles: ['ADMIN', 'AGENT'] },
  { id: 'feedbacks', label: 'Avaliações', icon: <MessageSquare className="w-5 h-5" />, roles: [UserRole.ADM_MASTER, UserRole.BUSINESS, UserRole.USER, UserRole.GUARDIAN], staffRoles: ['ADMIN', 'AGENT'] },
  { id: 'customers', label: 'Clientes', icon: <Users className="w-5 h-5" />, roles: [UserRole.BUSINESS, UserRole.GUARDIAN], staffRoles: ['ADMIN', 'AGENT'] },
  { id: 'company_profile', label: 'Meu Negócio', icon: <Store className="w-5 h-5" />, roles: [UserRole.BUSINESS], staffRoles: ['ADMIN'] },
  { id: 'form_config', label: 'Config. Formulário', icon: <FormInput className="w-5 h-5" />, roles: [UserRole.BUSINESS], staffRoles: ['ADMIN'] },
  { id: 'benchmarking', label: 'Benchmarking', icon: <Globe className="w-5 h-5" />, roles: [UserRole.BUSINESS, UserRole.GUARDIAN], staffRoles: ['ADMIN'] },
  { id: 'bi', label: 'Inteligência (BI)', icon: <PieChart className="w-5 h-5" />, roles: [UserRole.BUSINESS, UserRole.GUARDIAN], staffRoles: ['ADMIN'] }
];

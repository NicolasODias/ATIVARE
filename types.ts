
export enum UserRole {
  ADM_MASTER = 'ADM_MASTER',
  BUSINESS = 'BUSINESS',
  USER = 'USER',
  GUARDIAN = 'GUARDIAN'
}

export type StaffRole = 'ADMIN' | 'AGENT' | 'VIEWER';

export type JobTitle = 'Dono' | 'Gerente' | 'Sub-gerente';

export type PlanType = 'TRIAL' | 'PRO' | 'ENTERPRISE';
export type AccountStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELED' | 'PAUSED';

export type FeedbackChannel = 'QR_CODE' | 'DIRECT_LINK' | 'MANUAL_CODE';

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

// Add Lead-related types
export type LeadStage = 'LEAD' | 'CONTACTED' | 'INTEREST' | 'PROPOSAL' | 'WON' | 'LOST';
export type LeadTemperature = 'NEW' | 'HOT' | 'WARM' | 'COLD';

export interface LeadHistory {
  id: string;
  text: string;
  userName: string;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  action: string;
  performedBy: string;
  targetId: string;
  targetName: string;
  timestamp: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  staffRole?: StaffRole; 
  companyId?: string;
  linkedCompanyIds?: string[]; // IDs das empresas que o Guardião ou Master pode acessar
  phone?: string;
  profilePhoto?: string;
  jobTitle?: JobTitle;
  isOnboarded: boolean;
  mustChangePassword?: boolean; // Forçar troca de senha no primeiro login
  createdAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
  // Add missing properties used in CRM
  stage: LeadStage;
  temperature: LeadTemperature;
  monthlyValue: number;
  implementationValue: number;
  consultingValue: number;
  forecast?: string;
  contractStatus: 'NONE' | 'PENDING' | 'SIGNED';
  source?: string;
  history: LeadHistory[];
  createdAt: string;
}

export interface Company {
  id: string;
  trackingCode: string;
  name: string;
  description?: string;
  category: string;
  city: string;
  logo: string;
  experienceScore: number;
  cnpj?: string;
  address?: string;
  employees?: string;
  phone?: string;
  email?: string;
  trialEndDate?: string;
  startDate?: string;
  nextBillingDate?: string;
  churnDate?: string;
  monthlyValue: number;
  implementationValue: number;
  plan: PlanType;
  status: AccountStatus;
  maxEvaluations: number;
  maxUsers: number;
  isGuardianConsultancy?: boolean; // Tag para acesso global de Guardiões
}

export type NPSCategory = 'PROMOTER' | 'PASSIVE' | 'DETRACTOR';

export type InternalQuestionType = 'TEXT' | 'SCALE_5' | 'SCALE_10' | 'YES_NO';

export interface InternalQuestion {
  id: string;
  companyId: string;
  text: string;
  type: InternalQuestionType;
  required: boolean;
  active: boolean;
  isPublic: boolean;
  order: number;
}

export interface Feedback {
  id: string;
  companyId: string;
  companyTrackingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  howKnown: string;
  channel?: FeedbackChannel;
  scores: {
    service: number;
    food: number;
    drinks: number;
    structure: number;
  };
  internalResponses?: { [questionId: string]: any };
  profile: 'family' | 'friends' | 'couple' | 'kids';
  observation: string;
  createdAt: string;
  category: NPSCategory;
  averageScore: number;
  email?: string;
}

export interface CaseNote {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Case {
  id: string;
  feedbackId: string;
  companyId: string;
  status: CaseStatus;
  resolutionText?: string;
  notes: CaseNote[];
  updatedAt: string;
}

export type ContactLogType = 'INTERNAL_NOTE' | 'WHATSAPP' | 'CALL' | 'EMAIL' | 'VISIT';

export interface ContactLog {
  id: string;
  type: ContactLogType;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  profile?: 'family' | 'friends' | 'couple' | 'kids';
  firstSeen: string;
  lastSeen: string;
  averageScore: number;
  totalFeedbacks: number;
  category: NPSCategory;
  contactLogs: ContactLog[];
}


import { Feedback, Case, Customer, NPSCategory, InternalQuestion, ContactLog, Company, User, UserRole, StaffRole, PlanType, AccountStatus, FeedbackChannel, Lead, JobTitle, AdminLog, CaseStatus, ContactLogType, InternalQuestionType, LeadStage } from '../types';
import { MOCK_COMPANIES, MOCK_USERS } from '../constants';

class DataStore {
  private companies: Company[] = [...MOCK_COMPANIES];
  private users: User[] = [...MOCK_USERS];
  private leads: Lead[] = [];
  private feedbacks: Feedback[] = [];
  private cases: Case[] = [];
  private customers: Customer[] = [];
  private internalQuestions: InternalQuestion[] = [];
  private adminLogs: AdminLog[] = [];

  constructor() {
    this.initMockData();
  }

  private initMockData() {
    const bellaMGId = 'c-test';
    const bellaMGCode = 'BELLA1';

    const oldFeedbacks = [
      { date: '2025-09-15T19:30:00Z', score: 6, obs: "A pizza demorou muito para chegar." },
      { date: '2025-10-25T22:30:00Z', score: 6, obs: "Esperava mais pelo preço cobrado." }
    ];

    oldFeedbacks.forEach((f, i) => {
      this.addFeedback({
        companyId: bellaMGId,
        companyTrackingCode: bellaMGCode,
        customerId: '',
        customerName: `Cliente Antigo ${i + 1}`,
        customerPhone: `(35) 99999-000${i}`,
        howKnown: 'Indicação',
        scores: { service: f.score, food: f.score, drinks: f.score, structure: f.score },
        profile: 'family',
        observation: f.obs
      }, f.date);
    });

    const recentFeedbacks = [
      { date: '2026-01-25T20:00:00Z', score: 10, obs: "Simplesmente a melhor pizzaria da região." }
    ];

    recentFeedbacks.forEach((f, i) => {
      this.addFeedback({
        companyId: bellaMGId,
        companyTrackingCode: bellaMGCode,
        customerId: '',
        customerName: `Cliente Novo ${i + 1}`,
        customerPhone: `(35) 98888-000${i}`,
        howKnown: 'Instagram',
        scores: { service: f.score, food: f.score, drinks: f.score, structure: f.score },
        profile: 'couple',
        observation: f.obs
      }, f.date);
    });
  }

  private addAdminLog(action: string, by: string, targetId: string, targetName: string, details: string) {
    const log: AdminLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      action,
      performedBy: by,
      targetId,
      targetName,
      timestamp: new Date().toISOString(),
      details
    };
    this.adminLogs.unshift(log);
  }

  getAdminLogs() { return this.adminLogs; }

  adminUpdateCompany(companyId: string, data: Partial<Company>, adminName: string) {
    const idx = this.companies.findIndex(c => c.id === companyId);
    if (idx >= 0) {
      const old = this.companies[idx];
      this.companies[idx] = { ...old, ...data };
      this.addAdminLog('UPDATE_COMPANY', adminName, companyId, old.name, JSON.stringify(data));
      return { ...this.companies[idx] };
    }
    return null;
  }

  adminToggleGuardianConsultancy(companyId: string, adminName: string) {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      company.isGuardianConsultancy = !company.isGuardianConsultancy;
      this.addAdminLog(
        'TOGGLE_GUARDIAN_CONSULTANCY', 
        adminName, 
        companyId, 
        company.name, 
        `Consultoria Guardiã: ${company.isGuardianConsultancy ? 'ATIVADA' : 'DESATIVADA'}`
      );
      return { ...company };
    }
    return null;
  }

  adminChangeUserRole(userId: string, newRole: UserRole, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const oldRole = user.role;
      user.role = newRole;
      this.addAdminLog('CHANGE_ROLE', adminName, userId, user.name, `De ${oldRole} para ${newRole}`);
      return { ...user };
    }
    return null;
  }

  adminResetPassword(userId: string, newPass: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.password = newPass;
      user.mustChangePassword = true;
      this.addAdminLog('RESET_PASSWORD', adminName, userId, user.name, 'Senha redefinida pelo Master');
      return true;
    }
    return false;
  }

  createAccountManual(companyData: any, userData: any, adminName: string) {
    const cid = `c-${Date.now()}`;
    const company: Company = {
      id: cid,
      trackingCode: companyData.trackingCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: companyData.name,
      address: companyData.address,
      cnpj: companyData.cnpj,
      employees: companyData.employees,
      city: companyData.city,
      phone: companyData.phone,
      email: companyData.email,
      category: companyData.category,
      plan: companyData.plan,
      experienceScore: 0,
      monthlyValue: companyData.plan === 'PRO' ? 199 : 500,
      implementationValue: 1000,
      status: 'ACTIVE',
      maxEvaluations: companyData.plan === 'PRO' ? 500 : 10000,
      maxUsers: companyData.plan === 'PRO' ? 10 : 100,
      startDate: new Date().toISOString(),
      logo: `https://picsum.photos/seed/company-${cid}/200`
    };
    this.companies.push(company);
    
    const user: User = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      jobTitle: userData.jobTitle,
      companyId: cid,
      role: UserRole.BUSINESS,
      staffRole: 'ADMIN',
      isOnboarded: false,
      mustChangePassword: true,
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    
    this.addAdminLog('CREATE_ACCOUNT_MANUAL', adminName, cid, company.name, 'Conta provisionada manualmente pelo Master');
    return { company: { ...company }, user: { ...user } };
  }

  completeMandatoryPasswordChange(userId: string, newPass: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.password = newPass;
      user.mustChangePassword = false;
      user.isOnboarded = true;
      // Retorna uma cópia para o React detectar mudança de estado
      return { ...user };
    }
    return null;
  }

  updatePassword(userId: string, currentPass: string, newPass: string) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.password === currentPass) {
      user.password = newPass;
      user.mustChangePassword = false;
      return true;
    }
    return false;
  }

  adminProvisionGuardian(name: string, email: string, companyId: string, adminName: string) {
    let guardian = this.users.find(u => u.email === email && u.role === UserRole.GUARDIAN);
    if (!guardian) {
      guardian = {
        id: `u-${Date.now()}`,
        name,
        email,
        role: UserRole.GUARDIAN,
        isOnboarded: true,
        linkedCompanyIds: [companyId],
        createdAt: new Date().toISOString(),
        password: '123'
      };
      this.users.push(guardian);
    } else {
      if (!guardian.linkedCompanyIds) guardian.linkedCompanyIds = [];
      if (!guardian.linkedCompanyIds.includes(companyId)) {
        guardian.linkedCompanyIds.push(companyId);
      }
    }
    this.addAdminLog('PROVISION_GUARDIAN', adminName, guardian.id, guardian.name, `Vínculo com empresa ${companyId}`);
    return { ...guardian };
  }

  adminLinkGuardianToCompany(userId: string, companyId: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.role === UserRole.GUARDIAN) {
      if (!user.linkedCompanyIds) user.linkedCompanyIds = [];
      if (!user.linkedCompanyIds.includes(companyId)) {
        user.linkedCompanyIds.push(companyId);
        this.addAdminLog('LINK_GUARDIAN', adminName, userId, user.name, `Vínculo com empresa ${companyId}`);
      }
    }
  }

  adminUnlinkGuardianFromCompany(userId: string, companyId: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.role === UserRole.GUARDIAN && user.linkedCompanyIds) {
      user.linkedCompanyIds = user.linkedCompanyIds.filter(id => id !== companyId);
      this.addAdminLog('UNLINK_GUARDIAN', adminName, userId, user.name, `Desvínculo com empresa ${companyId}`);
    }
  }

  adminRemoveCollaborator(userId: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.users = this.users.filter(u => u.id !== userId);
      this.addAdminLog('REMOVE_USER', adminName, userId, user.name, 'Usuário removido pelo Master');
    }
  }

  authenticate(email: string, pass: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (user && user.password === pass) return { ...user };
    return null;
  }

  getCompany(id: string) { return this.companies.find(c => c.id === id); }
  getCompanyByTrackingCode(code: string) { return this.companies.find(c => c.trackingCode === code); }
  getAllCompanies() { return [...this.companies]; }
  
  getCompanyUsers(cid: string) { return this.users.filter(u => u.companyId === cid).map(u => ({ ...u })); }
  getAllUsers() { return this.users.map(u => ({ ...u })); }

  updateCompany(id: string, data: any) { 
    const idx = this.companies.findIndex(c => c.id === id);
    if (idx >= 0) { this.companies[idx] = { ...this.companies[idx], ...data }; return { ...this.companies[idx] }; }
    return null;
  }
  
  addCompanyUser(cid: string, data: any) {
    const newUser: User = { id: `u-${Date.now()}`, ...data, companyId: cid, role: data.role || UserRole.USER, isOnboarded: true, createdAt: new Date().toISOString() };
    this.users.push(newUser);
    return { ...newUser };
  }
  
  updateUser(id: string, data: any) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) { this.users[idx] = { ...this.users[idx], ...data }; return { ...this.users[idx] }; }
    return null;
  }

  addFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'category' | 'averageScore'>, customDate?: string) {
    const company = this.getCompany(feedback.companyId);
    if (!company) throw new Error("Empresa não encontrada");
    const avg = (feedback.scores.service + feedback.scores.food + feedback.scores.drinks + feedback.scores.structure) / 4;
    let cat: NPSCategory = avg >= 9 ? 'PROMOTER' : avg <= 6 ? 'DETRACTOR' : 'PASSIVE';
    const createdAt = customDate || new Date().toISOString();
    
    let customer = this.customers.find(c => c.phone === feedback.customerPhone && c.companyId === feedback.companyId);
    if (!customer) {
      customer = { id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, companyId: feedback.companyId, name: feedback.customerName, phone: feedback.customerPhone, email: feedback.email, profile: feedback.profile, firstSeen: createdAt, lastSeen: createdAt, averageScore: avg, totalFeedbacks: 1, category: cat, contactLogs: [] };
      this.customers.push(customer);
    } else {
      customer.lastSeen = createdAt;
      customer.totalFeedbacks += 1;
      const cFbs = this.feedbacks.filter(f => f.customerId === customer?.id);
      customer.averageScore = (cFbs.reduce((acc, f) => acc + f.averageScore, 0) + avg) / (cFbs.length + 1);
      customer.category = customer.averageScore >= 9 ? 'PROMOTER' : customer.averageScore <= 6 ? 'DETRACTOR' : 'PASSIVE';
      customer.name = feedback.customerName;
    }

    const newFeedback: Feedback = { ...feedback, id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, createdAt, category: cat, averageScore: avg, customerId: customer.id };
    this.feedbacks.push(newFeedback);

    const allCFbs = this.feedbacks.filter(f => f.companyId === feedback.companyId);
    company.experienceScore = Math.round((allCFbs.reduce((acc, f) => acc + f.averageScore, 0) / allCFbs.length) * 10);

    if (cat === 'DETRACTOR') {
      this.createCaseFromFeedback(newFeedback.id, feedback.companyId, "Abertura automática: Feedback Detrator.", "Sistema Ativare", "sys");
    }

    return newFeedback;
  }

  getFeedbacks(cid?: string) { return cid ? this.feedbacks.filter(f => f.companyId === cid).map(f => ({ ...f })) : this.feedbacks.map(f => ({ ...f })); }
  getCustomers(cid: string) { return this.customers.filter(c => c.companyId === cid).map(c => ({ ...c })); }
  getCustomerHistory(customerId: string) { return this.feedbacks.filter(f => f.customerId === customerId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(f => ({ ...f })); }
  getCases(cid?: string) { return cid ? this.cases.filter(c => c.companyId === cid).map(c => ({ ...c })) : this.cases.map(c => ({ ...c })); }
  getCaseForFeedback(fid: string) { 
    const c = this.cases.find(c => c.feedbackId === fid);
    return c ? { ...c } : undefined;
  }
  
  getDashboardStats(cid: string) {
    const fb = this.getFeedbacks(cid);
    return {
      total: fb.length, promoters: fb.filter(f => f.category === 'PROMOTER').length, detractors: fb.filter(f => f.category === 'DETRACTOR').length,
      passives: fb.filter(f => f.category === 'PASSIVE').length, avgScore: Math.round(fb.length > 0 ? (fb.reduce((acc, f) => acc + f.averageScore, 0) / fb.length) * 10 : 0),
      openDetractors: this.cases.filter(c => c.companyId === cid && c.status === 'OPEN').length, resolvedDetractors: this.cases.filter(c => c.companyId === cid && c.status === 'RESOLVED').length,
      catAvg: {
        service: fb.length > 0 ? (fb.reduce((acc, f) => acc + f.scores.service, 0) / fb.length) : 0,
        food: fb.length > 0 ? (fb.reduce((acc, f) => acc + f.scores.food, 0) / fb.length) : 0,
        drinks: fb.length > 0 ? (fb.reduce((acc, f) => acc + f.scores.drinks, 0) / fb.length) : 0,
        structure: fb.length > 0 ? (fb.reduce((acc, f) => acc + f.scores.structure, 0) / fb.length) : 0,
      }
    };
  }

  getBIData(cid: string, days = 30) {
    const startDate = new Date(); startDate.setDate(startDate.getDate() - days);
    const fb = this.feedbacks.filter(f => f.companyId === cid && new Date(f.createdAt) >= startDate);
    const trend: any = {};
    fb.forEach(f => {
      const d = new Date(f.createdAt).toLocaleDateString('pt-BR');
      if (!trend[d]) trend[d] = { sum: 0, count: 0 };
      trend[d].sum += f.averageScore; trend[d].count += 1;
    });
    return {
      trendData: Object.keys(trend).map(date => ({ date, score: Math.round((trend[date].sum / trend[date].count) * 10) })),
      heatmap: Array.from({ length: 7 }, () => Array(24).fill(0)), impacts: [], sentiments: { positive: [], negative: [] }, prediction: 85,
      rawSummary: { totalEvaluations: fb.length, detractorsCount: fb.filter(f => f.category === 'DETRACTOR').length, promotersCount: fb.filter(f => f.category === 'PROMOTER').length, averageScores: { service: 8, food: 8, drinks: 8, structure: 8 }, recentComments: fb.map(f => f.observation).filter(Boolean) }
    };
  }

  getBenchmarkingData(cid: string, s?: string) {
    const comp = this.getCompany(cid);
    if (!comp) return null;
    return { currentScore: comp.experienceScore, marketAverage: 82, marketCatAvg: { service: 8.2, food: 8.5, drinks: 8.0, structure: 8.1 }, ranking: [{ name: comp.name, score: comp.experienceScore }, { name: 'Outra Empresa', score: 85 }], position: 2, totalInSegment: 150, percentile: 88 };
  }

  getMasterFinanceStats() {
    const mrr = 15400;
    const pipelineRevenue = 8500;
    return {
      mrr,
      arr: mrr * 12,
      totalImplementation: 5500,
      totalConsulting: 2500,
      pipelineRevenue,
      activeClients: 12,
      churnRate: 1.2,
      arpu: 1280,
      revenueByPlan: { 'BASIC': 4500, 'PRO': 8900, 'ENTERPRISE': 2000 },
      revenueByStage: { 'LEAD': 1200, 'CONTACTED': 1000, 'INTEREST': 1500, 'PROPOSAL': 4800, 'WON': 15400 },
      leadsByStage: { 'LEAD': 5, 'CONTACTED': 3, 'INTEREST': 4, 'PROPOSAL': 2, 'WON': 2 },
      mostSoldPlan: 'PRO',
      conversionRate: 22.5,
      leadsCount: 16
    };
  }

  getMasterCSStats() {
    const globalScore = this.companies.reduce((acc, c) => acc + c.experienceScore, 0) / this.companies.length;
    return { globalScore: Math.round(globalScore), distribution: { promoters: 70, passives: 20, detractors: 10 }, ranking: this.companies.map(c => ({ id: c.id, name: c.name, city: c.city, segment: c.category, nps: c.experienceScore, status: 'PROMOTER' as any })), atRisk: [], segmentAverages: [], trendData: [], totalEvaluations: this.feedbacks.length };
  }

  getInternalQuestions(cid: string, active = true) { 
    return this.internalQuestions.filter(q => q.companyId === cid && (!active || q.active)).map(q => ({ ...q })); 
  }

  saveInternalQuestion(q: InternalQuestion) {
    const idx = this.internalQuestions.findIndex(iq => iq.id === q.id);
    if (idx >= 0) {
      this.internalQuestions[idx] = q;
    } else {
      this.internalQuestions.push(q);
    }
  }

  deleteInternalQuestion(id: string) {
    this.internalQuestions = this.internalQuestions.filter(q => q.id !== id);
  }

  getInternalMetrics(cid: string) {
    const questions = this.internalQuestions.filter(q => q.companyId === cid);
    const feedbacks = this.feedbacks.filter(f => f.companyId === cid);
    
    return questions.map(q => {
      const responses = feedbacks.map(f => f.internalResponses?.[q.id]).filter(v => v !== undefined && v !== null);
      let avg = 0;
      if (q.type === 'SCALE_5' || q.type === 'SCALE_10') {
        const nums = responses.filter(v => typeof v === 'number') as number[];
        avg = nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
      } else if (q.type === 'YES_NO') {
        const yesCount = responses.filter(v => v === 'SIM').length;
        avg = responses.length > 0 ? (yesCount / responses.length) * 100 : 0;
      }
      
      return {
        text: q.text,
        type: q.type,
        totalResponses: responses.length,
        average: avg
      };
    });
  }

  updateFeedbackInternalResponses(fid: string, r: any) {
    const fb = this.feedbacks.find(f => f.id === fid);
    if (fb) {
      fb.internalResponses = { ...(fb.internalResponses || {}), ...r };
      return { ...fb };
    }
    return null;
  }

  createCaseFromFeedback(fid: string, cid: string, n: string, un: string, ui: string) {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      feedbackId: fid,
      companyId: cid,
      status: 'OPEN',
      notes: n ? [{ id: `n-${Date.now()}`, text: n, userName: un, userId: ui, createdAt: new Date().toISOString() }] : [],
      updatedAt: new Date().toISOString()
    };
    this.cases.push(newCase);
    return { ...newCase };
  }

  addCaseNote(cid: string, uid: string, un: string, t: string) {
    const c = this.cases.find(item => item.id === cid);
    if (c) {
      c.notes.push({ id: `n-${Date.now()}`, text: t, userName: un, userId: uid, createdAt: new Date().toISOString() });
      c.updatedAt = new Date().toISOString();
    }
  }

  resolveCase(cid: string, rt: string, un: string, ui: string) {
    const c = this.cases.find(item => item.id === cid);
    if (c) {
      c.status = 'RESOLVED';
      c.resolutionText = rt;
      c.updatedAt = new Date().toISOString();
      this.addCaseNote(cid, ui, un, `Caso resolvido: ${rt}`);
    }
  }

  addContactLog(custid: string, log: Omit<ContactLog, 'id' | 'createdAt'>) {
    const c = this.customers.find(item => item.id === custid);
    if (c) {
      c.contactLogs.push({ ...log, id: `log-${Date.now()}`, createdAt: new Date().toISOString() });
    }
  }

  requestCNPJChange(cid: string, req: any) {
    this.addAdminLog('CNPJ_CHANGE_REQUEST', req.userName, cid, 'Business', `Novo CNPJ: ${req.requestedCNPJ}. Motivo: ${req.reason}`);
  }

  addLead(data: any) {
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      status: 'NEW',
      stage: 'LEAD',
      temperature: 'NEW',
      monthlyValue: 0,
      implementationValue: 0,
      consultingValue: 0,
      contractStatus: 'NONE',
      source: data.source || 'Manual',
      history: [{ id: 'h1', text: 'Lead criado no sistema.', userName: 'Sistema', createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    this.leads.push(lead);
    return { ...lead };
  }

  getLeads() { return this.leads.map(l => ({ ...l })); }

  updateLead(id: string, data: Partial<Lead>, adminName: string) {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx >= 0) {
      this.leads[idx] = { ...this.leads[idx], ...data };
      if (data.stage) {
         this.leads[idx].history.push({ id: `h-${Date.now()}`, text: `Estágio alterado para: ${data.stage}`, userName: adminName, createdAt: new Date().toISOString() });
      }
      return { ...this.leads[idx] };
    }
    return null;
  }

  deleteLead(id: string) {
    this.leads = this.leads.filter(l => l.id !== id);
  }
}

export const dataStore = new DataStore();

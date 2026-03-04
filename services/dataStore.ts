
import { Feedback, Case, Customer, NPSCategory, InternalQuestion, ContactLog, Company, User, UserRole, StaffRole, PlanType, AccountStatus, FeedbackChannel, Lead, JobTitle, AdminLog, CaseStatus, ContactLogType, InternalQuestionType, LeadStage, LeadTask } from '../types';
import { MOCK_COMPANIES, MOCK_USERS, BENCHMARK_MIN_EVALS } from '../constants';

class DataStore {
  private companies: Company[] = [...MOCK_COMPANIES];
  private users: User[] = [...MOCK_USERS];
  private leads: Lead[] = [
    {
      id: 'lead-1',
      name: 'João Silva',
      email: 'joao@restaurante.com',
      phone: '(11) 99999-8888',
      companyName: 'Restaurante Sabor Real',
      status: 'NEW',
      stage: 'LEAD',
      temperature: 'HOT',
      monthlyValue: 199,
      implementationValue: 500,
      consultingValue: 0,
      contractStatus: 'NONE',
      source: 'Landing Page',
      history: [],
      tasks: [{ id: 't1', text: 'Ligar para João', completed: false, createdAt: new Date().toISOString(), dueDate: new Date().toISOString().split('T')[0] }],
      createdAt: new Date().toISOString()
    },
    {
      id: 'lead-2',
      name: 'Maria Clara',
      email: 'maria@clinica.com',
      phone: '(21) 98888-7777',
      companyName: 'Clínica Bem Estar',
      status: 'NEW',
      stage: 'PROPOSAL',
      temperature: 'WARM',
      monthlyValue: 299,
      implementationValue: 1000,
      consultingValue: 1500,
      contractStatus: 'PENDING',
      source: 'Login Page',
      history: [{ id: 'h1', text: 'Proposta enviada via WhatsApp', userName: 'Nicolas Dias', createdAt: new Date().toISOString() }],
      tasks: [],
      createdAt: new Date().toISOString()
    }
  ];
  private feedbacks: Feedback[] = [];
  private cases: Case[] = [];
  private customers: Customer[] = [];
  private internalQuestions: InternalQuestion[] = [];
  private adminLogs: AdminLog[] = [];

  constructor() {
    this.initMockData();
  }

  private initMockData() {
    const ativareClientId = 'c-client-test';
    const ativareClientCode = 'ATIV12';

    // Gerando mais dados para o Mock de Crescimento
    const names = ["João", "Maria", "Carlos", "Ana", "Pedro", "Juliana", "Ricardo", "Fernanda", "Lucas", "Bia"];
    const dates = [
      '2024-11-10T14:30:00Z', '2024-11-20T12:00:00Z', '2024-12-05T19:00:00Z',
      '2024-12-15T13:00:00Z', '2025-01-02T14:00:00Z', '2025-01-10T20:00:00Z',
      '2025-01-20T12:00:00Z', '2025-02-01T15:00:00Z', '2025-02-10T19:00:00Z',
      '2025-02-15T21:00:00Z', '2025-02-18T12:00:00Z'
    ];

    // Criar feedbacks variados para simular recorrência
    dates.forEach((date, i) => {
      const nameIdx = i % names.length;
      const score = 7 + (i % 4); // Scores entre 7 e 10
      this.addFeedback({
        companyId: ativareClientId,
        companyTrackingCode: ativareClientCode,
        customerId: '',
        customerName: names[nameIdx],
        customerPhone: `(11) 98888-000${nameIdx}`,
        customerBirthDate: `19${80 + nameIdx}-0${(i % 9) + 1}-15`,
        howKnown: 'Instagram',
        channel: 'QR_CODE',
        scores: { service: score, food: score, drinks: score, structure: score },
        profile: 'couple',
        observation: "Ótimo!",
        customerType: 'local'
      }, date);
    });
  }

  // --- GROWTH SERVICE (PREPARADO PARA SUPABASE) ---

  async getGrowthMetrics(companyId: string, options: { days: number, riskDays: number }) {
    // SUPABASE TODO: 
    // const { data: feedbacks } = await supabase.from('feedbacks').select('*').eq('company_id', companyId).gte('created_at', startDate)
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - options.days);
    
    const companyFeedbacks = this.feedbacks.filter(f => 
      f.companyId === companyId && new Date(f.createdAt) >= startDate
    );

    const customersMap: Record<string, { visits: number, firstVisit: Date, lastVisit: Date, npsSum: number, birthDate?: string }> = {};

    companyFeedbacks.forEach(f => {
      if (!customersMap[f.customerPhone]) {
        customersMap[f.customerPhone] = { 
          visits: 0, 
          firstVisit: new Date(f.createdAt), 
          lastVisit: new Date(f.createdAt), 
          npsSum: 0,
          birthDate: f.customerBirthDate
        };
      }
      customersMap[f.customerPhone].visits += 1;
      customersMap[f.customerPhone].npsSum += f.averageScore;
      const fDate = new Date(f.createdAt);
      if (fDate < customersMap[f.customerPhone].firstVisit) customersMap[f.customerPhone].firstVisit = fDate;
      if (fDate > customersMap[f.customerPhone].lastVisit) customersMap[f.customerPhone].lastVisit = fDate;
    });

    const totalCustomers = Object.keys(customersMap).length;
    const returningCustomers = Object.values(customersMap).filter(c => c.visits >= 2).length;
    
    const totalVisits = companyFeedbacks.length;
    const avgFrequency = totalCustomers > 0 ? totalVisits / totalCustomers : 0;
    const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

    // Tempo médio de retorno (clientes recorrentes)
    let totalReturnDays = 0;
    let returnCount = 0;
    Object.values(customersMap).forEach(c => {
      if (c.visits >= 2) {
        const diff = c.lastVisit.getTime() - c.firstVisit.getTime();
        totalReturnDays += diff / (1000 * 3600 * 24);
        returnCount++;
      }
    });
    const avgReturnDays = returnCount > 0 ? totalReturnDays / returnCount : 0;

    // Segmentação
    const segmentation = {
      uniques: Object.values(customersMap).filter(c => c.visits === 1).length,
      recurrents: Object.values(customersMap).filter(c => c.visits >= 2 && c.visits <= 4).length,
      loyal: Object.values(customersMap).filter(c => c.visits >= 5).length
    };

    // Idades
    const ageRanges: Record<string, { count: number, visits: number }> = {
      "18-24": { count: 0, visits: 0 },
      "25-34": { count: 0, visits: 0 },
      "35-44": { count: 0, visits: 0 },
      "45-54": { count: 0, visits: 0 },
      "55-64": { count: 0, visits: 0 },
      "65+": { count: 0, visits: 0 },
      "Não informado": { count: 0, visits: 0 }
    };

    Object.values(customersMap).forEach(c => {
      if (!c.birthDate) {
        ageRanges["Não informado"].count++;
        ageRanges["Não informado"].visits += c.visits;
        return;
      }
      const age = new Date().getFullYear() - new Date(c.birthDate).getFullYear();
      let range = "";
      if (age < 18) return; // Ignorar menores conforme regra
      else if (age <= 24) range = "18-24";
      else if (age <= 34) range = "25-34";
      else if (age <= 44) range = "35-44";
      else if (age <= 54) range = "45-54";
      else if (age <= 64) range = "55-64";
      else range = "65+";
      
      ageRanges[range].count++;
      ageRanges[range].visits += c.visits;
    });

    // NPS x Retorno
    const npsReturn = {
      promoter: { sum: 0, count: 0 },
      passive: { sum: 0, count: 0 },
      detractor: { sum: 0, count: 0 }
    };

    Object.values(customersMap).forEach(c => {
      const avgNPS = c.npsSum / c.visits;
      const cat = avgNPS >= 9 ? 'promoter' : avgNPS <= 6 ? 'detractor' : 'passive';
      npsReturn[cat].sum += c.visits;
      npsReturn[cat].count += 1;
    });

    return {
      totalCustomers,
      totalVisits,
      avgFrequency,
      retentionRate,
      avgReturnDays,
      segmentation,
      ageRanges,
      npsCorrelation: {
        promoter: npsReturn.promoter.count > 0 ? npsReturn.promoter.sum / npsReturn.promoter.count : 0,
        passive: npsReturn.passive.count > 0 ? npsReturn.passive.sum / npsReturn.passive.count : 0,
        detractor: npsReturn.detractor.count > 0 ? npsReturn.detractor.sum / npsReturn.detractor.count : 0
      }
    };
  }

  async listAtRiskCustomers(companyId: string, riskDays: number) {
    // SUPABASE TODO:
    // const { data } = await supabase.from('customers').select('*').eq('company_id', companyId).gte('total_visits', 2)
    // Filter logic on front initially
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - riskDays);

    return this.customers
      .filter(c => c.companyId === companyId && c.totalFeedbacks >= 2 && new Date(c.lastSeen) < limitDate)
      .sort((a, b) => b.totalFeedbacks - a.totalFeedbacks)
      .slice(0, 10);
  }

  // --- SUPABASE PREPARATION STUBS ---
  async supabaseUpdateUserPassword(userId: string, newPass: string) {
    return this.completeMandatoryPasswordChange(userId, newPass);
  }

  async supabaseUpdateCNPJRequest(companyId: string, cnpj: string) {
    // Stub para integração futura
  }

  // --- HELPERS DE CONTEXTO ---
  
  getActiveBusinessId(user: User, localStorageId: string | null): string | null {
    if (!user) return null;
    if (user.role === UserRole.BUSINESS || user.role === UserRole.USER) {
      return user.companyId || null;
    }
    return localStorageId;
  }

  // --- DATA RETRIEVAL METHODS ---
  
  authenticate(email: string, pass: string): User | null {
    const normalized = email.trim().toLowerCase();
    const user = this.users.find(u => u.email.trim().toLowerCase() === normalized);
    if (user && user.password === pass) return { ...user };
    return null;
  }

  createAccountManual(companyData: any, userData: any, adminName: string) {
    const cid = `c-${Date.now()}`;
    const company: Company = { 
      id: cid, 
      trackingCode: companyData.trackingCode || "GEN123", 
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
      totalEvaluations: 0, 
      benchmarkEligible: false, 
      monthlyValue: 199, 
      implementationValue: 1000, 
      status: 'ACTIVE', 
      maxEvaluations: 500, 
      maxUsers: 10, 
      startDate: new Date().toISOString(), 
      logo: `https://picsum.photos/seed/${cid}/200` 
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
    
    this.adminLogs.push({
      id: `log-${Date.now()}`,
      action: 'MANUAL_ACCOUNT_CREATION',
      performedBy: adminName,
      targetId: cid,
      targetName: company.name,
      timestamp: new Date().toISOString(),
      details: `Provisionamento de nova conta contratante. E-mail: ${user.email}`
    });

    return { company, user };
  }

  completeMandatoryPasswordChange(userId: string, newPass: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) { 
      user.password = newPass; 
      user.mustChangePassword = false; 
      user.isOnboarded = true; 
      return { ...user }; 
    }
    return null;
  }

  getCompanyByTrackingCode(code: string) {
    const normalized = code.trim().toUpperCase();
    return this.companies.find(c => c.trackingCode.toUpperCase() === normalized);
  }

  addFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'category' | 'averageScore'>, customDate?: string) {
    const company = this.companies.find(c => c.id === feedback.companyId);
    if (!company) throw new Error("Empresa não encontrada");
    
    const avg = (feedback.scores.service + feedback.scores.food + feedback.scores.drinks + feedback.scores.structure) / 4;
    let cat: NPSCategory = avg >= 9 ? 'PROMOTER' : avg <= 6 ? 'DETRACTOR' : 'PASSIVE';
    const createdAt = customDate || new Date().toISOString();
    
    let customer = this.customers.find(c => c.phone === feedback.customerPhone && c.companyId === feedback.companyId);
    if (!customer) {
      customer = { 
        id: `cust-${Date.now()}`, companyId: feedback.companyId, name: feedback.customerName, phone: feedback.customerPhone, email: feedback.email, birthDate: feedback.customerBirthDate, profile: feedback.profile, customerType: feedback.customerType, firstSeen: createdAt, lastSeen: createdAt, averageScore: avg, totalFeedbacks: 1, category: cat, contactLogs: [] 
      };
      this.customers.push(customer);
    } else {
      customer.lastSeen = createdAt;
      customer.totalFeedbacks += 1;
      const cFbs = this.feedbacks.filter(f => f.customerId === customer?.id);
      customer.averageScore = (cFbs.reduce((acc, f) => acc + f.averageScore, 0) + avg) / (cFbs.length + 1);
      customer.category = customer.averageScore >= 9 ? 'PROMOTER' : customer.averageScore <= 6 ? 'DETRACTOR' : 'PASSIVE';
    }

    const newFeedback: Feedback = { ...feedback, id: `f-${Date.now()}`, createdAt, category: cat, averageScore: avg, customerId: customer.id };
    this.feedbacks.push(newFeedback);

    const allCFbs = this.feedbacks.filter(f => f.companyId === feedback.companyId);
    company.experienceScore = Math.round((allCFbs.reduce((acc, f) => acc + f.averageScore, 0) / allCFbs.length) * 10);
    this.ensureBenchmarkEligibility(company.id);

    if (avg <= 6) this.createCaseFromFeedback(newFeedback.id, feedback.companyId, "Feedback Detrator automático.", "Sistema", "sys");
    return newFeedback;
  }

  updateFeedbackInternalResponses(feedbackId: string, responses: { [questionId: string]: any }) {
    const idx = this.feedbacks.findIndex(f => f.id === feedbackId);
    if (idx >= 0) {
      this.feedbacks[idx] = { ...this.feedbacks[idx], internalResponses: { ...(this.feedbacks[idx].internalResponses || {}), ...responses } };
      return { ...this.feedbacks[idx] };
    }
    return null;
  }

  getCompany(id: string) { return this.companies.find(c => c.id === id); }
  getAllCompanies() { return [...this.companies]; }
  getFeedbacks(cid?: string) { return cid ? this.feedbacks.filter(f => f.companyId === cid).map(f => ({ ...f })) : this.feedbacks.map(f => ({ ...f })); }
  getCustomers(cid: string) { return this.customers.filter(c => c.companyId === cid).map(c => ({ ...c })); }
  getCustomerHistory(customerId: string): Feedback[] { return this.feedbacks.filter(f => f.customerId === customerId); }
  getCases(cid?: string) { return cid ? this.cases.filter(c => c.companyId === cid).map(c => ({ ...c })) : this.cases.map(c => ({ ...c })); }
  getCaseForFeedback(feedbackId: string): Case | null { return this.cases.find(c => c.feedbackId === feedbackId) || null; }
  getAdminLogs() { return this.adminLogs; }
  getLeads() { return this.leads.map(l => ({ ...l })); }

  updateCompany(id: string, data: any) { 
    const idx = this.companies.findIndex(c => c.id === id);
    if (idx >= 0) { this.companies[idx] = { ...this.companies[idx], ...data }; return { ...this.companies[idx] }; }
    return null;
  }
  
  updateUser(id: string, data: any) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) { this.users[idx] = { ...this.users[idx], ...data }; return { ...this.users[idx] }; }
    return null;
  }

  getDashboardStats(cid: string) {
    if (!cid) return { total: 0, promoters: 0, detractors: 0, passives: 0, avgScore: 0, openDetractors: 0, resolvedDetractors: 0, customerTypeDist: { local: 0, tourist: 0 }, catAvg: { service: 0, food: 0, drinks: 0, structure: 0 } };
    const fb = this.getFeedbacks(cid);
    return {
      total: fb.length, promoters: fb.filter(f => f.category === 'PROMOTER').length, detractors: fb.filter(f => f.category === 'DETRACTOR').length,
      passives: fb.filter(f => f.category === 'PASSIVE').length, avgScore: Math.round(fb.length > 0 ? (fb.reduce((acc, f) => acc + f.averageScore, 0) / fb.length) * 10 : 0),
      openDetractors: this.cases.filter(c => c.companyId === cid && c.status === 'OPEN').length, resolvedDetractors: this.cases.filter(c => c.companyId === cid && c.status === 'RESOLVED').length,
      customerTypeDist: { local: 50, tourist: 50 },
      catAvg: { service: 8, food: 8, drinks: 8, structure: 8 }
    };
  }

  getBIData(cid: string, days = 30) {
    if (!cid) return null;
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
      prediction: 85,
      rawSummary: { totalEvaluations: fb.length, detractorsCount: fb.filter(f => f.category === 'DETRACTOR').length, promotersCount: fb.filter(f => f.category === 'PROMOTER').length, averageScores: { service: 8, food: 8, drinks: 8, structure: 8 }, recentComments: fb.map(f => f.observation).filter(Boolean) }
    };
  }

  async getTotalEvaluationsForBusiness(companyId: string): Promise<number> {
    if (!companyId) return 0;
    return this.feedbacks.filter(f => f.companyId === companyId).length;
  }

  async ensureBenchmarkEligibility(companyId: string): Promise<boolean> {
    const company = this.companies.find(c => c.id === companyId);
    if (!company) return false;
    const realCount = await this.getTotalEvaluationsForBusiness(companyId);
    if (realCount >= BENCHMARK_MIN_EVALS && !company.benchmarkEligible) {
      company.benchmarkEligible = true;
    }
    return company.benchmarkEligible;
  }

  async getBenchmarkingData(cid: string, s?: string) {
    const comp = this.getCompany(cid);
    if (!comp) return null;
    const realCount = await this.getTotalEvaluationsForBusiness(cid);
    const isEligible = await this.ensureBenchmarkEligibility(cid);
    const eligibleCompanies = this.companies.filter(c => c.benchmarkEligible && (!c.hiddenFromBenchmarking || c.id === cid));
    const ranking = eligibleCompanies.map(c => ({ name: c.name, score: c.experienceScore })).sort((a, b) => b.score - a.score);
    return { currentScore: comp.experienceScore, marketAverage: 82, marketCatAvg: { service: 8.2, food: 8.5, drinks: 8.0, structure: 8.1 }, ranking, position: ranking.findIndex(r => r.name === comp.name) + 1, totalInSegment: ranking.length, percentile: 88, isEligible, totalEvaluations: realCount, minEvaluationsRequired: BENCHMARK_MIN_EVALS };
  }

  getInternalQuestions(cid: string, active = true) { return this.internalQuestions.filter(q => q.companyId === cid && (!active || q.active)).map(q => ({ ...q })); }
  saveInternalQuestion(q: InternalQuestion) { const idx = this.internalQuestions.findIndex(iq => iq.id === q.id); if (idx >= 0) { this.internalQuestions[idx] = q; } else { this.internalQuestions.push(q); } }
  deleteInternalQuestion(id: string) { this.internalQuestions = this.internalQuestions.filter(q => q.id !== id); }

  getInternalMetrics(cid: string) {
    if (!cid) return [];
    const questions = this.internalQuestions.filter(q => q.companyId === cid);
    return questions.map(q => ({ text: q.text, type: q.type, totalResponses: 0, average: 0 }));
  }

  createCaseFromFeedback(fid: string, cid: string, n: string, un: string, ui: string) {
    const newCase: Case = { id: `case-${Date.now()}`, feedbackId: fid, companyId: cid, status: 'OPEN', notes: [], updatedAt: new Date().toISOString() };
    this.cases.push(newCase); return { ...newCase };
  }

  resolveCase(cid: string, rt: string, un: string, ui: string) { const c = this.cases.find(item => item.id === cid); if (c) { c.status = 'RESOLVED'; c.resolutionText = rt; c.updatedAt = new Date().toISOString(); } }
  addCaseNote(cid: string, uid: string, un: string, t: string) { const c = this.cases.find(item => item.id === cid); if (c) { c.notes.push({ id: `n-${Date.now()}`, text: t, userName: un, userId: uid, createdAt: new Date().toISOString() }); } }
  addContactLog(custid: string, log: Omit<ContactLog, 'id' | 'createdAt'>) { const c = this.customers.find(item => item.id === custid); if (c) { c.contactLogs.push({ ...log, id: `log-${Date.now()}`, createdAt: new Date().toISOString() }); } }
  
  addLead(data: any) {
    const lead: Lead = { id: `lead-${Date.now()}`, name: data.name, email: data.email, phone: data.phone, companyName: data.companyName, status: 'NEW', stage: 'LEAD', temperature: 'NEW', monthlyValue: data.monthlyValue || 0, implementationValue: data.implementationValue || 0, consultingValue: data.consultingValue || 0, contractStatus: 'NONE', source: data.source || 'Manual', history: [], tasks: [], createdAt: new Date().toISOString() };
    this.leads.push(lead); return { ...lead };
  }
  updateLead(id: string, data: Partial<Lead>, adminName: string) {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx >= 0) { this.leads[idx] = { ...this.leads[idx], ...data }; return { ...this.leads[idx] }; }
    return null;
  }
  deleteLead(id: string) { this.leads = this.leads.filter(l => l.id !== id); }
  addTaskToLead(leadId: string, text: string, dueDate?: string) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) { const task: LeadTask = { id: `t-${Date.now()}`, text, completed: false, dueDate, createdAt: new Date().toISOString() }; lead.tasks.push(task); return { ...lead }; }
    return null;
  }
  toggleLeadTask(leadId: string, taskId: string) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) { const task = lead.tasks.find(t => t.id === taskId); if (task) { task.completed = !task.completed; return { ...lead }; } }
    return null;
  }
  deleteLeadTask(leadId: string, taskId: string) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) { lead.tasks = lead.tasks.filter(t => t.id !== taskId); return { ...lead }; }
    return null;
  }

  adminUpdateCompany(companyId: string, data: Partial<Company>, adminName: string) {
    const idx = this.companies.findIndex(c => c.id === companyId);
    if (idx >= 0) { this.companies[idx] = { ...this.companies[idx], ...data }; return { ...this.companies[idx] }; }
    return null;
  }
  adminToggleGuardianConsultancy(companyId: string, adminName: string) {
    const company = this.companies.find(c => c.id === companyId);
    if (company) { company.isGuardianConsultancy = !company.isGuardianConsultancy; return { ...company }; }
    return null;
  }
  adminProvisionGuardian(name: string, email: string, companyId: string, adminName: string) {
    let guardian = this.users.find(u => u.email === email && u.role === UserRole.GUARDIAN);
    if (!guardian) { guardian = { id: `u-${Date.now()}`, name, email, role: UserRole.GUARDIAN, isOnboarded: true, linkedCompanyIds: [companyId], createdAt: new Date().toISOString(), password: '123' }; this.users.push(guardian); }
    else { if (!guardian.linkedCompanyIds?.includes(companyId)) guardian.linkedCompanyIds = [...(guardian.linkedCompanyIds || []), companyId]; }
    return guardian;
  }
  adminUnlinkGuardianFromCompany(userId: string, companyId: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user?.role === UserRole.GUARDIAN) user.linkedCompanyIds = user.linkedCompanyIds?.filter(id => id !== companyId);
  }

  adminLinkGuardianToCompany(userId: string, companyId: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user?.role === UserRole.GUARDIAN) {
      if (!user.linkedCompanyIds?.includes(companyId)) {
        user.linkedCompanyIds = [...(user.linkedCompanyIds || []), companyId];
      }
    }
  }

  adminRemoveCollaborator(userId: string, adminName: string) { this.users = this.users.filter(u => u.id !== userId); }
  adminChangeUserRole(userId: string, newRole: UserRole, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) { user.role = newRole; return { ...user }; }
    return null;
  }
  adminResetPassword(userId: string, newPass: string, adminName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) { user.password = newPass; return true; }
    return false;
  }

  requestCNPJChange(companyId: string, data: { userId: string, userName: string, requestedCNPJ: string, reason: string }) {
    const company = this.getCompany(companyId);
    this.adminLogs.push({
      id: `log-${Date.now()}`,
      action: 'CNPJ_CHANGE_REQUEST',
      performedBy: data.userName,
      targetId: companyId,
      targetName: company?.name || 'Empresa desconhecida',
      timestamp: new Date().toISOString(),
      details: `Solicitação de alteração de CNPJ para ${data.requestedCNPJ}. Motivo: ${data.reason}`
    });
  }

  updatePassword(userId: string, currentPass: string, newPass: string) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.password === currentPass) { user.password = newPass; return true; }
    return false;
  }

  getCompanyUsers(cid: string) { return this.users.filter(u => u.companyId === cid).map(u => ({ ...u })); }
  getAllUsers() { return this.users.map(u => ({ ...u })); }
  addCompanyUser(cid: string, data: any) {
    const newUser: User = { id: `u-${Date.now()}`, ...data, companyId: cid, role: data.role || UserRole.USER, isOnboarded: true, createdAt: new Date().toISOString() };
    this.users.push(newUser); return newUser;
  }

  getMasterFinanceStats() { 
    const activeCompanies = this.companies.filter(c => c.status === 'ACTIVE');
    const mrr = activeCompanies.reduce((acc, c) => acc + c.monthlyValue, 0);
    const totalImplementation = activeCompanies.reduce((acc, c) => acc + c.implementationValue, 0);
    const pipelineRevenue = this.leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST').reduce((acc, l) => acc + l.monthlyValue, 0);
    
    return { 
      mrr, 
      arr: mrr * 12, 
      totalImplementation, 
      totalConsulting: 5000, 
      pipelineRevenue, 
      revenueByStage: {
        'LEAD': this.leads.filter(l => l.stage === 'LEAD').reduce((acc, l) => acc + l.monthlyValue, 0),
        'CONTACTED': this.leads.filter(l => l.stage === 'CONTACTED').reduce((acc, l) => acc + l.monthlyValue, 0),
        'INTEREST': this.leads.filter(l => l.stage === 'INTEREST').reduce((acc, l) => acc + l.monthlyValue, 0),
        'PROPOSAL': this.leads.filter(l => l.stage === 'PROPOSAL').reduce((acc, l) => acc + l.monthlyValue, 0),
      }, 
      leadsByStage: {
        'LEAD': this.leads.filter(l => l.stage === 'LEAD').length,
        'CONTACTED': this.leads.filter(l => l.stage === 'CONTACTED').length,
        'INTEREST': this.leads.filter(l => l.stage === 'INTEREST').length,
        'PROPOSAL': this.leads.filter(l => l.stage === 'PROPOSAL').length,
      }, 
      conversionRate: 22, 
      arpu: mrr / (activeCompanies.length || 1), 
      leadsCount: this.leads.length, 
      activeClients: activeCompanies.length 
    }; 
  }

  getMasterCSStats() { return { globalScore: 82, totalEvaluations: this.feedbacks.length, ranking: [], distribution: { promoters: 70, passives: 20, detractors: 10 }, atRisk: [], segmentAverages: [] }; }
}

export const dataStore = new DataStore();

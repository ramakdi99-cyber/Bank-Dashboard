export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER';
export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
export type ProjectHealth = 'GREEN' | 'AMBER' | 'RED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PortfolioStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'ON_HOLD';
export type PortfolioHealth = 'GREEN' | 'AMBER' | 'RED';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roles?: string[];
  enabled?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Portfolio {
  id: number;
  name: string;
  description: string;
  owner: string;
  status: PortfolioStatus;
  health: PortfolioHealth;
  budget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioRequest {
  name: string;
  description: string;
  owner: string;
  status: PortfolioStatus;
  health: PortfolioHealth;
  budget: number;
  actualCost?: number;
  startDate?: string;
  endDate?: string;
  completionPercentage?: number;
}

export interface PortfolioSummary {
  id: number;
  name: string;
  status: PortfolioStatus;
  health: PortfolioHealth;
  budget: number;
  completionPercentage: number;
  projectCount: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  portfolioId: number;
  portfolioName: string;
  projectManager: string;
  status: ProjectStatus;
  health: ProjectHealth;
  priority: ProjectPriority;
  budget: number;
  actualCost: number;
  completionPercentage: number;
  startDate: string;
  endDate: string;
  riskCount: number;
  updateCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest {
  name: string;
  description: string;
  portfolioId: number;
  projectManager: string;
  status: ProjectStatus;
  health: ProjectHealth;
  priority: ProjectPriority;
  budget: number;
  actualCost?: number;
  completionPercentage?: number;
  startDate?: string;
  endDate?: string;
}

export interface ProjectRisk {
  id: number;
  projectId: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  mitigation: string;
  createdAt: string;
}

export interface ProjectUpdate {
  id: number;
  projectId?: number;
  title: string;
  content: string;
  author: string;
  projectName?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalPortfolios: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  atRiskProjects: number;
  totalBudget: number;
  totalActualCost: number;
  totalRisks: number;
  openRisks: number;
  projectStatusDistribution: Record<string, number>;
  projectHealthDistribution: Record<string, number>;
  recentUpdates: ProjectUpdate[];
}

export interface DashboardAnalytics {
  statusDistribution: Record<string, number>;
  healthDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  budgetVsActual: { name: string; budget: number; actualCost: number }[];
  portfolioPerformance: { id: number; name: string; completionPercentage: number; health: string; projectCount: number }[];
  recentUpdates: ProjectUpdate[];
}

export interface PortfolioPerformanceItem {
  id: number;
  name: string;
  budget: number;
  actualCost: number;
  completionPercentage: number;
  health: string;
  status: string;
  projectCount: number;
}

export interface ProjectAnalytics {
  projectsByStatus: Record<string, number>;
  projectsByPriority: Record<string, number>;
  projectsByHealth: Record<string, number>;
  totalBudget: number;
  totalActualCost: number;
}

export interface PortfolioAnalytics {
  portfoliosByStatus: Record<string, number>;
  portfoliosByHealth: Record<string, number>;
  portfolioPerformance: PortfolioPerformanceItem[];
}

export interface FinancialAnalytics {
  totalBudget: number;
  totalActualCost: number;
  budgetVariance: number;
  budgetUtilization: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  first: boolean;
  last: boolean;
}

export interface ErrorResponse {
  message: string;
  details?: string;
  timestamp: string;
}

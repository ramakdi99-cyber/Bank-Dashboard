import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  Portfolio,
  PortfolioRequest,
  PagedResponse,
  Project,
  ProjectRequest,
  DashboardSummary,
  DashboardAnalytics,
  ProjectAnalytics,
  PortfolioAnalytics,
  FinancialAnalytics,
  User,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },
  register: async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

export const portfolioApi = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }): Promise<PagedResponse<Portfolio>> => {
    const response = await api.get<PagedResponse<Portfolio>>('/portfolios', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Portfolio> => {
    const response = await api.get<Portfolio>(`/portfolios/${id}`);
    return response.data;
  },
  create: async (data: PortfolioRequest): Promise<Portfolio> => {
    const response = await api.post<Portfolio>('/portfolios', data);
    return response.data;
  },
  update: async (id: number, data: PortfolioRequest): Promise<Portfolio> => {
    const response = await api.put<Portfolio>(`/portfolios/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/portfolios/${id}`);
  },
  search: async (query: string): Promise<Portfolio[]> => {
    const response = await api.get<Portfolio[]>('/portfolios/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export const projectApi = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    health?: string;
    priority?: string;
    portfolioId?: number;
  }): Promise<PagedResponse<Project>> => {
    const response = await api.get<PagedResponse<Project>>('/projects', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },
  create: async (data: ProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },
  update: async (id: number, data: ProjectRequest): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
  search: async (query: string): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get<DashboardAnalytics>('/dashboard/analytics');
    return response.data;
  },
};

export const analyticsApi = {
  getProjectAnalytics: async (): Promise<ProjectAnalytics> => {
    const response = await api.get<ProjectAnalytics>('/analytics/projects');
    return response.data;
  },
  getPortfolioAnalytics: async (): Promise<PortfolioAnalytics> => {
    const response = await api.get<PortfolioAnalytics>('/analytics/portfolios');
    return response.data;
  },
  getFinancialAnalytics: async (): Promise<FinancialAnalytics> => {
    const response = await api.get<FinancialAnalytics>('/analytics/financial');
    return response.data;
  },
};

export const userApi = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PagedResponse<User>> => {
    const response = await api.get<PagedResponse<User>>('/users', { params });
    return response.data;
  },
  updateRole: async (id: number, role: string): Promise<User> => {
    const response = await api.put<User>(`/users/${id}/role`, { role });
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};

export default api;

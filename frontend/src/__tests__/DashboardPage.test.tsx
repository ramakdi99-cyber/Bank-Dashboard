import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';

const mockGetSummary = vi.fn();
const mockGetAnalytics = vi.fn();
const mockGetPortfolioAnalytics = vi.fn();

vi.mock('../services/api', () => ({
  dashboardApi: {
    getSummary: (...args: unknown[]) => mockGetSummary(...args),
    getAnalytics: (...args: unknown[]) => mockGetAnalytics(...args),
  },
  analyticsApi: {
    getPortfolioAnalytics: (...args: unknown[]) => mockGetPortfolioAnalytics(...args),
  },
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'admin', role: 'ADMIN' },
    isAuthenticated: true,
    isAdmin: true,
    loading: false,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../utils/formatters', () => ({
  formatCurrency: (val: number) => `$${val.toLocaleString()}`,
  formatDate: (val: string) => new Date(val).toLocaleDateString(),
  formatPercentage: (val: number) => `${val}%`,
}));

const renderDashboardPage = () => {
  return render(
    <BrowserRouter>
      <DashboardPage />
    </BrowserRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders KPI cards when data is loaded', async () => {
    mockGetSummary.mockResolvedValueOnce({
      totalPortfolios: 5,
      totalProjects: 16,
      activeProjects: 10,
      completedProjects: 3,
      delayedProjects: 2,
      atRiskProjects: 2,
      totalBudget: 18600000,
      totalActualCost: 9075000,
      projectStatusDistribution: {},
      projectHealthDistribution: {},
      recentUpdates: [],
    });
    mockGetPortfolioAnalytics.mockResolvedValueOnce({});

    renderDashboardPage();

    await waitFor(() => {
      expect(screen.getByText('Total Portfolios')).toBeInTheDocument();
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
      expect(screen.getByText('Completed Projects')).toBeInTheDocument();
    });
  });

  it('displays data from API', async () => {
    mockGetSummary.mockResolvedValueOnce({
      totalPortfolios: 5,
      totalProjects: 16,
      activeProjects: 10,
      completedProjects: 3,
      delayedProjects: 2,
      atRiskProjects: 2,
      totalBudget: 18600000,
      totalActualCost: 9075000,
      projectStatusDistribution: {},
      projectHealthDistribution: {},
      recentUpdates: [],
    });
    mockGetPortfolioAnalytics.mockResolvedValueOnce({});

    renderDashboardPage();

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('16')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('shows loading skeletons while data is being fetched', () => {
    mockGetSummary.mockReturnValueOnce(new Promise(() => {}));
    mockGetPortfolioAnalytics.mockReturnValueOnce(new Promise(() => {}));

    const { container } = renderDashboardPage();

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state when API call fails', async () => {
    mockGetSummary.mockRejectedValueOnce(new Error('Network error'));
    mockGetPortfolioAnalytics.mockRejectedValueOnce(new Error('Network error'));

    renderDashboardPage();

    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
    });
  });
});

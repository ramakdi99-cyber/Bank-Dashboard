import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PortfolioListPage } from '../pages/PortfolioListPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockGetAll = vi.fn();
vi.mock('../services/api', () => ({
  portfolioApi: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
  },
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'admin', role: 'ADMIN' },
    isAuthenticated: true,
    isAdmin: true,
    isManager: true,
    isViewer: false,
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
  formatPercentage: (val: number) => `${val}%`,
}));

const mockPortfolios = [
  {
    id: 1,
    name: 'Digital Banking',
    description: 'Digital transformation',
    owner: 'Sarah Mitchell',
    status: 'ACTIVE',
    health: 'GREEN',
    budget: 5000000,
    completionPercentage: 47,
    projectCount: 4,
  },
  {
    id: 2,
    name: 'Compliance',
    description: 'Regulatory compliance',
    owner: 'James Rodriguez',
    status: 'ACTIVE',
    health: 'AMBER',
    budget: 3200000,
    completionPercentage: 59,
    projectCount: 3,
  },
];

const renderPortfolioListPage = () => {
  return render(
    <BrowserRouter>
      <PortfolioListPage />
    </BrowserRouter>
  );
};

describe('PortfolioListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAll.mockResolvedValue({
      content: mockPortfolios,
      totalElements: 2,
      totalPages: 1,
      size: 10,
      number: 0,
    });
  });

  it('renders portfolio table with data', async () => {
    renderPortfolioListPage();

    await waitFor(() => {
      expect(screen.getByText('Portfolios')).toBeInTheDocument();
      expect(screen.getByText('Digital Banking')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
    });
  });

  it('search filters results', async () => {
    renderPortfolioListPage();

    await waitFor(() => {
      expect(screen.getByText('Digital Banking')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search portfolios/i);
    fireEvent.change(searchInput, { target: { value: 'Compliance' } });

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Compliance' })
      );
    });
  });

  it('status filter works', async () => {
    renderPortfolioListPage();

    await waitFor(() => {
      expect(screen.getByText('Digital Banking')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'ACTIVE' } });

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ACTIVE' })
      );
    });
  });

  it('shows create button for ADMIN', async () => {
    renderPortfolioListPage();

    await waitFor(() => {
      expect(screen.getByText('New Portfolio')).toBeInTheDocument();
    });
  });

  it('renders page header', async () => {
    renderPortfolioListPage();

    expect(screen.getByText('Portfolios')).toBeInTheDocument();
    expect(screen.getByText('Manage your project portfolios')).toBeInTheDocument();
  });
});

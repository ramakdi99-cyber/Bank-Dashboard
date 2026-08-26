import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProjectListPage } from '../pages/ProjectListPage';

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
  projectApi: {
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

const mockProjects = [
  {
    id: 1,
    name: 'Core Banking Migration',
    description: 'Migrate core banking system',
    portfolio: { name: 'Digital Banking', id: 1 },
    manager: { firstName: 'Sarah', lastName: 'Mitchell' },
    status: 'ACTIVE',
    health: 'GREEN',
    priority: 'CRITICAL',
    budget: 1500000,
    completionPercentage: 52,
  },
  {
    id: 2,
    name: 'AML Monitoring',
    description: 'AML transaction monitoring',
    portfolio: { name: 'Compliance', id: 2 },
    manager: { firstName: 'James', lastName: 'Rodriguez' },
    status: 'DELAYED',
    health: 'RED',
    priority: 'HIGH',
    budget: 1200000,
    completionPercentage: 60,
  },
  {
    id: 3,
    name: 'Push Notifications',
    description: 'Push notification service',
    portfolio: { name: 'Mobile Banking', id: 3 },
    manager: { firstName: 'Tom', lastName: 'Harris' },
    status: 'PLANNING',
    health: 'GREEN',
    priority: 'MEDIUM',
    budget: 350000,
    completionPercentage: 0,
  },
];

const renderProjectListPage = () => {
  return render(
    <BrowserRouter>
      <ProjectListPage />
    </BrowserRouter>
  );
};

describe('ProjectListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAll.mockResolvedValue({
      content: mockProjects,
      totalElements: 3,
      totalPages: 1,
      size: 10,
      number: 0,
    });
  });

  it('renders project table with data', async () => {
    renderProjectListPage();

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Core Banking Migration')).toBeInTheDocument();
      expect(screen.getByText('AML Monitoring')).toBeInTheDocument();
    });
  });

  it('multiple filters work', async () => {
    renderProjectListPage();

    await waitFor(() => {
      expect(screen.getByText('Core Banking Migration')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'ACTIVE' } });

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ACTIVE' })
      );
    });

    const healthSelect = screen.getByLabelText(/health/i);
    fireEvent.change(healthSelect, { target: { value: 'RED' } });

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ACTIVE', health: 'RED' })
      );
    });
  });

  it('pagination works', async () => {
    mockGetAll.mockResolvedValueOnce({
      content: mockProjects,
      totalElements: 25,
      totalPages: 3,
      size: 10,
      number: 0,
    });

    renderProjectListPage();

    await waitFor(() => {
      expect(screen.getByText('Core Banking Migration')).toBeInTheDocument();
    });

    const nextPageButton = screen.getByLabelText(/next/i);
    if (nextPageButton) {
      fireEvent.click(nextPageButton);

      await waitFor(() => {
        expect(mockGetAll).toHaveBeenCalledWith(
          expect.objectContaining({ page: 1 })
        );
      });
    }
  });

  it('renders page header and create button', async () => {
    renderProjectListPage();

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Manage all projects across portfolios')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('New Project')).toBeInTheDocument();
    });
  });

  it('search filters projects', async () => {
    renderProjectListPage();

    await waitFor(() => {
      expect(screen.getByText('Core Banking Migration')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search projects/i);
    fireEvent.change(searchInput, { target: { value: 'AML' } });

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'AML' })
      );
    });
  });
});

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { portfolioApi } from '../services/api';
import { Portfolio } from '../types';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { FilterSelect } from '../components/ui/FilterSelect';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

export const PortfolioListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(10);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await portfolioApi.getAll({
        page: pagination.pagination.page,
        size: pagination.pagination.size,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
      });
      setPortfolios(response.content);
      pagination.setTotal(response.totalElements, response.totalPages);
    } catch {
      toast.error('Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  }, [pagination.pagination.page, pagination.pagination.size, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    pagination.setPage(0);
  }, [debouncedSearch, statusFilter]);

  const columns: Column<Portfolio>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (portfolio) => (
        <div>
          <p className="font-medium text-navy-600">{portfolio.name}</p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">{portfolio.description}</p>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (portfolio) => (
        <span className="text-gray-600">{portfolio.owner}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (portfolio) => <StatusBadge value={portfolio.status} variant="status" />,
    },
    {
      key: 'health',
      header: 'Health',
      render: (portfolio) => <StatusBadge value={portfolio.health} variant="health" />,
    },
    {
      key: 'budget',
      header: 'Budget',
      sortable: true,
      render: (portfolio) => <span className="text-gray-700">{formatCurrency(portfolio.budget)}</span>,
    },
    {
      key: 'completionPercentage',
      header: 'Completion',
      sortable: true,
      render: (portfolio) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${portfolio.completionPercentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{formatPercentage(portfolio.completionPercentage)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Portfolios</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your project portfolios</p>
        </div>
        {(isAdmin || isManager) && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/portfolios/create')}>
            New Portfolio
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-64">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="All Statuses"
            label="Status"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={portfolios}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search portfolios..."
        onRowClick={(portfolio) => navigate(`/portfolios/${portfolio.id}`)}
        keyExtractor={(portfolio) => portfolio.id}
        pagination={{
          page: pagination.pagination.page,
          totalPages: pagination.pagination.totalPages,
          totalElements: pagination.pagination.totalElements,
          onPageChange: pagination.setPage,
        }}
        emptyMessage="No portfolios found. Create your first portfolio to get started."
        emptyTitle="No Portfolios"
      />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  FolderKanban,
  TrendingUp,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { portfolioApi, projectApi } from '../services/api';
import { Portfolio, Project } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { KPICard } from '../components/ui/KPICard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { DataTable, Column } from '../components/ui/DataTable';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import toast from 'react-hot-toast';

export const PortfolioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPortfolio = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const portfolioData = await portfolioApi.getById(Number(id));
      setPortfolio(portfolioData);
      try {
        const projRes = await projectApi.getAll({ portfolioId: Number(id), page: 0, size: 100 });
        setProjects(projRes.content || []);
      } catch {
        // projects list optional
      }
    } catch {
      setError('Failed to load portfolio details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await portfolioApi.delete(Number(id));
      toast.success('Portfolio deleted successfully');
      navigate('/portfolios');
    } catch {
      toast.error('Failed to delete portfolio');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="kpi" />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  if (error || !portfolio) {
    return <ErrorState message={error || 'Portfolio not found'} onRetry={fetchPortfolio} />;
  }

  const budgetUtilization = portfolio.budget > 0
    ? ((portfolio.actualCost / portfolio.budget) * 100)
    : 0;

  const budgetData = [
    { name: 'Budget', amount: portfolio.budget },
    { name: 'Spent', amount: portfolio.actualCost },
    { name: 'Remaining', amount: Math.max(0, portfolio.budget - portfolio.actualCost) },
  ];

  const projectColumns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      render: (project) => <span className="font-medium text-navy-600">{project.name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (project) => <StatusBadge value={project.status} variant="status" />,
    },
    {
      key: 'health',
      header: 'Health',
      render: (project) => <StatusBadge value={project.health} variant="health" />,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (project) => <StatusBadge value={project.priority} variant="priority" />,
    },
    {
      key: 'completionPercentage',
      header: 'Completion',
      render: (project) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${project.completionPercentage}%` }} />
          </div>
          <span className="text-xs font-medium text-gray-600">{formatPercentage(project.completionPercentage)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/portfolios')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-navy-600">{portfolio.name}</h1>
            <p className="text-sm text-gray-500">{portfolio.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge value={portfolio.status} variant="status" />
          <StatusBadge value={portfolio.health} variant="health" />
          {isAdmin && (
            <>
              <Button variant="secondary" size="sm" icon={<Edit className="h-4 w-4" />} onClick={() => navigate(`/portfolios/${id}/edit`)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteDialogOpen(true)}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Owner</p>
            <p className="text-sm font-medium text-gray-900">{portfolio.owner}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Duration</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(portfolio.startDate)} - {formatDate(portfolio.endDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Projects</p>
            <p className="text-sm font-medium text-gray-900">{portfolio.projectCount} projects</p>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"
          value={portfolio.projectCount}
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <KPICard
          title="Budget Utilization"
          value={formatPercentage(budgetUtilization)}
          icon={<TrendingUp className="h-5 w-5" />}
          subtitle={`${formatCurrency(portfolio.actualCost)} of ${formatCurrency(portfolio.budget)}`}
        />
        <KPICard
          title="Completion"
          value={formatPercentage(portfolio.completionPercentage)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Budget Remaining"
          value={formatCurrency(Math.max(0, portfolio.budget - portfolio.actualCost))}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Budget Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Projects Table */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-navy-600">Projects in this Portfolio</h3>
        </div>
        <DataTable
          columns={projectColumns}
          data={projects}
          searchable={false}
          onRowClick={(item) => navigate(`/projects/${item.id}`)}
          keyExtractor={(item) => item.id}
          emptyMessage="No projects in this portfolio yet."
          emptyTitle="No Projects"
        />
      </Card>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Portfolio"
        message={`Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

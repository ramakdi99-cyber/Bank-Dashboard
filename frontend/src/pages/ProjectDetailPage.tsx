import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileText,
} from 'lucide-react';
import { projectApi } from '../services/api';
import { Project } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { KPICard } from '../components/ui/KPICard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import toast from 'react-hot-toast';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProject = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await projectApi.getById(Number(id));
      setProject(data);
    } catch {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await projectApi.delete(Number(id));
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete project');
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
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (error || !project) {
    return <ErrorState message={error || 'Project not found'} onRetry={fetchProject} />;
  }

  const canEdit = isAdmin || isManager;
  const budgetUtilization = project.budget > 0 ? ((project.actualCost / project.budget) * 100) : 0;
  const daysRemaining = project.endDate
    ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-navy-600">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge value={project.status} variant="status" />
          <StatusBadge value={project.health} variant="health" />
          <StatusBadge value={project.priority} variant="priority" />
          {canEdit && (
            <>
              <Button variant="secondary" size="sm" icon={<Edit className="h-4 w-4" />} onClick={() => navigate(`/projects/${id}/edit`)}>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Portfolio</p>
            <button
              onClick={() => navigate(`/portfolios/${project.portfolioId}`)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {project.portfolioName || '-'}
            </button>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Manager</p>
            <p className="text-sm font-medium text-gray-900">{project.projectManager || '-'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Duration</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Days Remaining</p>
            <p className={`text-sm font-medium ${daysRemaining < 30 ? 'text-red-600' : 'text-gray-900'}`}>
              {daysRemaining} days
            </p>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Completion"
          value={formatPercentage(project.completionPercentage)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Budget"
          value={formatCurrency(project.budget)}
          icon={<DollarSign className="h-5 w-5" />}
          subtitle={`Spent: ${formatCurrency(project.actualCost)}`}
        />
        <KPICard
          title="Budget Utilization"
          value={formatPercentage(budgetUtilization)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Days Remaining"
          value={daysRemaining}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Risks */}
      {project.riskCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Risks ({project.riskCount})
            </CardTitle>
          </CardHeader>
          <div className="p-4 text-sm text-gray-600">
            This project has {project.riskCount} associated risk{project.riskCount !== 1 ? 's' : ''} that require attention.
          </div>
        </Card>
      )}

      {/* Recent Updates */}
      {project.updateCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" />
              Updates ({project.updateCount})
            </CardTitle>
          </CardHeader>
          <div className="p-4 text-sm text-gray-600">
            This project has {project.updateCount} update{project.updateCount !== 1 ? 's' : ''}.
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

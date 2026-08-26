import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { projectApi } from '../services/api';
import { Project } from '../types';
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
  { value: 'PLANNED', label: 'Planned' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DELAYED', label: 'Delayed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const healthOptions = [
  { value: 'GREEN', label: 'Green' },
  { value: 'AMBER', label: 'Amber' },
  { value: 'RED', label: 'Red' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(10);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectApi.getAll({
        page: pagination.pagination.page,
        size: pagination.pagination.size,
        status: statusFilter || undefined,
        health: healthFilter || undefined,
        priority: priorityFilter || undefined,
      });
      setProjects(response.content);
      pagination.setTotal(response.totalElements, response.totalPages);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [pagination.pagination.page, pagination.pagination.size, statusFilter, healthFilter, priorityFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    pagination.setPage(0);
  }, [statusFilter, healthFilter, priorityFilter]);

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      sortable: true,
      render: (project) => (
        <div>
          <p className="font-medium text-navy-600">{project.name}</p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">{project.description}</p>
        </div>
      ),
    },
    {
      key: 'portfolioName',
      header: 'Portfolio',
      render: (project) => (
        <span className="text-gray-600 text-sm">{project.portfolioName || '-'}</span>
      ),
    },
    {
      key: 'projectManager',
      header: 'Manager',
      render: (project) => (
        <span className="text-gray-600 text-sm">{project.projectManager || '-'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
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
      sortable: true,
      render: (project) => <StatusBadge value={project.priority} variant="priority" />,
    },
    {
      key: 'budget',
      header: 'Budget',
      sortable: true,
      render: (project) => <span className="text-gray-700">{formatCurrency(project.budget)}</span>,
    },
    {
      key: 'completionPercentage',
      header: 'Completion',
      sortable: true,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all projects across portfolios</p>
        </div>
        {(isAdmin || isManager) && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/projects/create')}>
            New Project
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="All Statuses"
            label="Status"
          />
        </div>
        <div className="w-full sm:w-48">
          <FilterSelect
            value={healthFilter}
            onChange={setHealthFilter}
            options={healthOptions}
            placeholder="All Health"
            label="Health"
          />
        </div>
        <div className="w-full sm:w-48">
          <FilterSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
            placeholder="All Priorities"
            label="Priority"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search projects..."
        onRowClick={(project) => navigate(`/projects/${project.id}`)}
        keyExtractor={(project) => project.id}
        pagination={{
          page: pagination.pagination.page,
          totalPages: pagination.pagination.totalPages,
          totalElements: pagination.pagination.totalElements,
          onPageChange: pagination.setPage,
        }}
        emptyMessage="No projects found. Create your first project to get started."
        emptyTitle="No Projects"
      />
    </div>
  );
};

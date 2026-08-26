import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  FolderKanban,
  PlayCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { dashboardApi } from '../services/api';
import { DashboardSummary, DashboardAnalytics } from '../types';
import { KPICard } from '../components/ui/KPICard';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const HEALTH_COLORS: Record<string, string> = {
  GREEN: '#22c55e',
  AMBER: '#f59e0b',
  RED: '#ef4444',
};

const STATUS_COLORS: Record<string, string> = {
  PLANNED: '#3b82f6',
  ACTIVE: '#6366f1',
  ON_HOLD: '#f59e0b',
  COMPLETED: '#22c55e',
  DELAYED: '#f97316',
  CANCELLED: '#ef4444',
};

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, analyticsRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getAnalytics(),
      ]);
      setSummary(summaryRes);
      setAnalytics(analyticsRes);
    } catch {
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="kpi" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  if (!summary) return null;

  const statusDistribution = Object.entries(summary.projectStatusDistribution || {}).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
    color: STATUS_COLORS[name] || '#94a3b8',
  }));

  const healthDistribution = Object.entries(summary.projectHealthDistribution || {}).map(([name, value]) => ({
    name,
    value,
    color: HEALTH_COLORS[name] || '#94a3b8',
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Portfolios"
          value={summary.totalPortfolios}
          icon={<Briefcase className="h-5 w-5" />}
        />
        <KPICard
          title="Total Projects"
          value={summary.totalProjects}
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <KPICard
          title="Active Projects"
          value={summary.activeProjects}
          icon={<PlayCircle className="h-5 w-5" />}
        />
        <KPICard
          title="Completed Projects"
          value={summary.completedProjects}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Delayed Projects"
          value={summary.delayedProjects}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="At-Risk Projects"
          value={summary.atRiskProjects}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <KPICard
          title="Total Budget"
          value={formatCurrency(summary.totalBudget)}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Actual Cost"
          value={formatCurrency(summary.totalActualCost)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <div className="h-72">
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} projects`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-steel-400 text-sm">No data available</div>
            )}
          </div>
        </Card>

        {/* Health Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Health Distribution</CardTitle>
          </CardHeader>
          <div className="h-72">
            {healthDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-steel-400 text-sm">No data available</div>
            )}
          </div>
        </Card>
      </div>

      {/* Budget vs Actual & Portfolio Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.budgetVsActual && analytics.budgetVsActual.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.budgetVsActual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actualCost" name="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {analytics?.portfolioPerformance && analytics.portfolioPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.portfolioPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Completion']} />
                  <Bar dataKey="completionPercentage" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Updates */}
      {summary.recentUpdates && summary.recentUpdates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Project Updates</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {summary.recentUpdates.slice(0, 5).map((update) => (
              <div key={update.id} className="flex gap-4 p-3 rounded-lg hover:bg-steel-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-navy-600 truncate">{update.title}</h4>
                  </div>
                  <p className="text-xs text-steel-500 line-clamp-2">{update.content}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-steel-400">{formatDate(update.createdAt)}</span>
                    <span className="text-[11px] text-steel-400">by {update.author}</span>
                    {update.projectName && (
                      <span className="text-[11px] text-primary-500">{update.projectName}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

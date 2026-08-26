import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { analyticsApi } from '../services/api';
import { ProjectAnalytics, PortfolioAnalytics, FinancialAnalytics } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const COLORS = ['#1e3a5f', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

type Tab = 'projects' | 'portfolios' | 'financial';

function recordToPieData(record: Record<string, number>): { name: string; value: number }[] {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics | null>(null);
  const [portfolioAnalytics, setPortfolioAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [financialAnalytics, setFinancialAnalytics] = useState<FinancialAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [projRes, portRes, finRes] = await Promise.all([
        analyticsApi.getProjectAnalytics(),
        analyticsApi.getPortfolioAnalytics(),
        analyticsApi.getFinancialAnalytics(),
      ]);
      setProjectAnalytics(projRes);
      setPortfolioAnalytics(portRes);
      setFinancialAnalytics(finRes);
    } catch {
      setError('Failed to load analytics data');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'projects', label: 'Projects' },
    { key: 'portfolios', label: 'Portfolios' },
    { key: 'financial', label: 'Financial' },
  ];

  const statusData = projectAnalytics ? recordToPieData(projectAnalytics.projectsByStatus) : [];
  const priorityData = projectAnalytics ? recordToPieData(projectAnalytics.projectsByPriority) : [];
  const healthData = projectAnalytics ? recordToPieData(projectAnalytics.projectsByHealth) : [];
  const portfolioPerf = portfolioAnalytics?.portfolioPerformance ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-600">Analytics</h1>
        <p className="text-sm text-steel-500 mt-1">Insights and performance metrics</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-steel-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-steel-500 hover:text-steel-700 hover:border-steel-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Project Analytics Tab */}
      {activeTab === 'projects' && projectAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {priorityData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Health Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Health Distribution</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Portfolio Analytics Tab */}
      {activeTab === 'portfolios' && portfolioAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Performance */}
            {portfolioPerf.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioPerf} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Completion']} />
                      <Bar dataKey="completionPercentage" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Budget Utilization */}
            {portfolioPerf.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Budget Utilization by Portfolio</CardTitle>
                </CardHeader>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioPerf}>
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
          </div>

          {/* Portfolio Status Distribution */}
          {Object.keys(portfolioAnalytics.portfoliosByStatus).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolios by Status</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recordToPieData(portfolioAnalytics.portfoliosByStatus)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1e3a5f" radius={[4, 4, 0, 0]}>
                      {recordToPieData(portfolioAnalytics.portfoliosByStatus).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Financial Analytics Tab */}
      {activeTab === 'financial' && financialAnalytics && (
        <div className="space-y-6">
          {/* Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-sm text-steel-500 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-navy-600">{formatCurrency(financialAnalytics.totalBudget)}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-steel-500 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(financialAnalytics.totalActualCost)}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-steel-500 mb-1">Variance</p>
              <p className={`text-2xl font-bold ${financialAnalytics.budgetVariance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(Math.abs(financialAnalytics.budgetVariance))}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-steel-500 mb-1">Utilization</p>
              <p className="text-2xl font-bold text-navy-600">{financialAnalytics.budgetUtilization.toFixed(1)}%</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

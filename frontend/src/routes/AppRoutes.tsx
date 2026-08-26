import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PortfolioListPage } from '../pages/PortfolioListPage';
import { PortfolioDetailPage } from '../pages/PortfolioDetailPage';
import { PortfolioFormPage } from '../pages/PortfolioFormPage';
import { ProjectListPage } from '../pages/ProjectListPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ProjectFormPage } from '../pages/ProjectFormPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolios"
        element={
          <ProtectedRoute>
            <PortfolioListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolios/create"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'MANAGER']}>
            <PortfolioFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolios/:id"
        element={
          <ProtectedRoute>
            <PortfolioDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolios/:id/edit"
        element={
          <ProtectedRoute requiredRole={['ADMIN']}>
            <PortfolioFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'MANAGER']}>
            <ProjectFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute requiredRole={['ADMIN', 'MANAGER']}>
            <ProjectFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole={['ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

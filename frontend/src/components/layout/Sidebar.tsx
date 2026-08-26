import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  Landmark,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/portfolios', icon: Briefcase, label: 'Portfolios' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const adminItems = [
    { to: '/admin/users', icon: Users, label: 'User Management' },
  ];

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <NavLink
        to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-white/15 text-white shadow-sm'
            : 'text-primary-200 hover:bg-white/10 hover:text-white'
        }`}
        title={collapsed ? label : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>{label}</span>}
      </NavLink>
    );
  };

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-b from-primary-600 to-primary-800 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg flex-shrink-0">
          <Landmark className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight">Banking PM</h1>
            <p className="text-[10px] text-primary-200 font-medium">Portfolio Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="mb-2">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary-300">
              Main Menu
            </p>
          )}
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-white/10">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary-300">
                Administration
              </p>
            )}
            {adminItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        )}
      </nav>

      {/* User info */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
            <p className="text-[11px] text-primary-200 truncate">{user.role}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          {!collapsed && (
            <button
              onClick={logout}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-primary-200 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

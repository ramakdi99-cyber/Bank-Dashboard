import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/portfolios': 'Portfolios',
  '/projects': 'Projects',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/admin/users': 'User Management',
};

export const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = (): string => {
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];
    if (location.pathname.match(/^\/portfolios\/\d+$/)) return 'Portfolio Details';
    if (location.pathname.match(/^\/projects\/\d+$/)) return 'Project Details';
    if (location.pathname.match(/^\/projects\/create$/)) return 'Create Project';
    if (location.pathname.match(/^\/projects\/\d+\/edit$/)) return 'Edit Project';
    if (location.pathname.match(/^\/portfolios\/create$/)) return 'Create Portfolio';
    if (location.pathname.match(/^\/portfolios\/\d+\/edit$/)) return 'Edit Portfolio';
    return 'Dashboard';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-steel-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-steel-500 hover:bg-steel-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-navy-600">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-steel-500 hover:bg-steel-100 hover:text-steel-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-steel-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-steel-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-[11px] text-steel-500">{user?.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-steel-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-steel-200 py-1 z-50">
              <button
                onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-steel-700 hover:bg-steel-50 transition-colors"
              >
                <User className="h-4 w-4" />
                My Profile
              </button>
              <button
                onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-steel-700 hover:bg-steel-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <hr className="my-1 border-steel-200" />
              <button
                onClick={() => { logout(); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

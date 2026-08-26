import React from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDate } from '../utils/formatters';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-600">My Profile</h1>
        <p className="text-sm text-steel-500 mt-1">View and manage your account information</p>
      </div>

      <Card>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-600">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-steel-500">@{user.username}</p>
            <div className="mt-1">
              <StatusBadge value={user.role} variant="default" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <User className="h-5 w-5 text-steel-400" />
            <div>
              <p className="text-xs text-steel-500">Full Name</p>
              <p className="text-sm font-medium text-steel-900">{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <Mail className="h-5 w-5 text-steel-400" />
            <div>
              <p className="text-xs text-steel-500">Email</p>
              <p className="text-sm font-medium text-steel-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <Shield className="h-5 w-5 text-steel-400" />
            <div>
              <p className="text-xs text-steel-500">Role</p>
              <p className="text-sm font-medium text-steel-900">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <Calendar className="h-5 w-5 text-steel-400" />
            <div>
              <p className="text-xs text-steel-500">Member Since</p>
              <p className="text-sm font-medium text-steel-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

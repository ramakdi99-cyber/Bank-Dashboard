import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, subtitle, className }) => {
  return (
    <div className={twMerge(clsx('bg-white rounded-xl p-6 shadow-card border border-steel-100 hover:shadow-card-hover transition-shadow duration-200', className))}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-steel-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-navy-600">{value}</p>
          {subtitle && <p className="text-xs text-steel-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className={clsx('flex items-center gap-1 mt-2 text-xs font-medium', trend.isPositive ? 'text-success-600' : 'text-danger-600')}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-steel-400">vs last period</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg bg-primary-50 text-primary-600')}>
          {icon}
        </div>
      </div>
    </div>
  );
};

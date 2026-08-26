import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatusBadgeProps {
  value: string;
  variant?: 'status' | 'health' | 'priority' | 'default';
  className?: string;
}

const statusColors: Record<string, string> = {
  PLANNED: 'bg-blue-100 text-blue-700 border-blue-200',
  ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ON_HOLD: 'bg-amber-100 text-amber-700 border-amber-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  DELAYED: 'bg-orange-100 text-orange-700 border-orange-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200',
  GREEN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  AMBER: 'bg-amber-100 text-amber-700 border-amber-200',
  RED: 'bg-red-100 text-red-700 border-red-200',
  LOW: 'bg-sky-100 text-sky-700 border-sky-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
};

const formatLabel = (value: string): string => {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ value, variant = 'default', className }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variant === 'status' && statusColors[value],
          variant === 'health' && statusColors[value],
          variant === 'priority' && statusColors[value],
          variant === 'default' && 'bg-gray-100 text-gray-700 border-gray-200',
          className
        )
      )}
    >
      {formatLabel(value)}
    </span>
  );
};

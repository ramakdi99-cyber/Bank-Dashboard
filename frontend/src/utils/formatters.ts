import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString || '-';
  }
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PLANNED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    ON_HOLD: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    DELAYED: 'bg-orange-100 text-orange-800',
    CANCELLED: 'bg-red-100 text-red-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getHealthColor = (health: string): string => {
  const colors: Record<string, string> = {
    GREEN: 'bg-green-100 text-green-800',
    AMBER: 'bg-amber-100 text-amber-800',
    RED: 'bg-red-100 text-red-800',
  };
  return colors[health] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    LOW: 'bg-sky-100 text-sky-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

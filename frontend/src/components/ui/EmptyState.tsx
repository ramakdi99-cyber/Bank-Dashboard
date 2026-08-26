import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  message,
  icon,
  action,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className || ''}`}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-steel-100 mb-4">
        {icon || <Inbox className="h-8 w-8 text-steel-400" />}
      </div>
      <h3 className="text-lg font-semibold text-navy-600 mb-2">{title}</h3>
      <p className="text-sm text-steel-500 text-center max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
};

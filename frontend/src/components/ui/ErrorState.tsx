import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className || ''}`}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-danger-50 mb-4">
        <AlertCircle className="h-8 w-8 text-danger-500" />
      </div>
      <h3 className="text-lg font-semibold text-navy-600 mb-2">{title}</h3>
      <p className="text-sm text-steel-500 text-center max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

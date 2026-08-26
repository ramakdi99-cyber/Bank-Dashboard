import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-steel-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={twMerge(
            clsx(
              'w-full px-3 py-2.5 border rounded-lg text-sm text-steel-900 placeholder:text-steel-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all duration-200',
              'resize-vertical min-h-[80px]',
              error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-steel-300',
              className
            )
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

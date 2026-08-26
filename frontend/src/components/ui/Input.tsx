import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-steel-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full px-3 py-2.5 border rounded-lg text-sm text-steel-900 placeholder:text-steel-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all duration-200',
              error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-steel-300',
              className
            )
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-steel-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

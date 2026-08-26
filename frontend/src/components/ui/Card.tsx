import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, padding = true, hover = false }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl shadow-card border border-steel-100',
          padding && 'p-6',
          hover && 'hover:shadow-card-hover transition-shadow duration-200',
          className
        )
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={twMerge('mb-4', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={twMerge('text-lg font-semibold text-navy-600', className)}>
      {children}
    </h3>
  );
};

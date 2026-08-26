import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  type?: 'text' | 'card' | 'table' | 'kpi';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 3, type = 'text', className }) => {
  const shimmer = 'animate-pulse bg-steel-200 rounded';

  if (type === 'kpi') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-card border border-steel-100">
            <div className={`${shimmer} h-4 w-24 mb-3`} />
            <div className={`${shimmer} h-8 w-32 mb-2`} />
            <div className={`${shimmer} h-3 w-20`} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-card border border-steel-100 ${className || ''}`}>
        <div className={`${shimmer} h-6 w-48 mb-4`} />
        <div className={`${shimmer} h-4 w-full mb-2`} />
        <div className={`${shimmer} h-4 w-3/4 mb-2`} />
        <div className={`${shimmer} h-4 w-1/2`} />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`bg-white rounded-xl shadow-card border border-steel-100 overflow-hidden ${className || ''}`}>
        <div className={`${shimmer} h-12 w-full`} />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-steel-100">
            <div className={`${shimmer} h-4 flex-1`} />
            <div className={`${shimmer} h-4 w-24`} />
            <div className={`${shimmer} h-4 w-20`} />
            <div className={`${shimmer} h-4 w-16`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${shimmer} h-4 w-full`} style={{ width: `${Math.random() * 40 + 60}%` }} />
      ))}
    </div>
  );
};

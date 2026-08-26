import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'All',
  label,
  className,
}) => {
  return (
    <div className={className || ''}>
      {label && <label className="block text-xs font-medium text-steel-500 mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full pl-3 pr-8 py-2.5 border border-steel-300 rounded-lg text-sm text-steel-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all duration-200 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel-400 pointer-events-none" />
      </div>
    </div>
  );
};

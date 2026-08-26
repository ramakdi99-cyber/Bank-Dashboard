import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  pagination?: {
    page: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
  emptyTitle?: string;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string | number;
}

export function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  pagination,
  emptyMessage = 'No data available.',
  emptyTitle = 'No results found',
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-steel-100">
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-steel-100 overflow-hidden">
      {searchable && onSearchChange && (
        <div className="px-6 py-4 border-b border-steel-200">
          <SearchInput value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
        </div>
      )}

      {data.length === 0 && !loading ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs font-semibold text-steel-600 uppercase tracking-wider bg-steel-50 border-b border-steel-200">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-6 py-3.5 ${col.sortable ? 'cursor-pointer select-none hover:bg-steel-100' : ''} ${col.className || ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.header}
                        {col.sortable && (
                          <span className="text-steel-400">
                            {sortKey === col.key ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr
                    key={keyExtractor ? keyExtractor(item) : index}
                    className={`border-b border-steel-100 hover:bg-steel-50/50 transition-colors duration-150 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-6 py-4 ${col.className || ''}`}>
                        {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalElements={pagination.totalElements}
              onPageChange={pagination.onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

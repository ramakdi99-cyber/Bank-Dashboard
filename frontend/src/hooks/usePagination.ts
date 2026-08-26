import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface UsePaginationReturn {
  pagination: PaginationState;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (totalElements: number, totalPages: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const usePagination = (initialSize: number = 10): UsePaginationReturn => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: initialSize,
    totalElements: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page: Math.max(0, page) }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({ ...prev, size, page: 0 }));
  }, []);

  const setTotal = useCallback((totalElements: number, totalPages: number) => {
    setPagination((prev) => ({ ...prev, totalElements, totalPages }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages - 1),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 0),
    }));
  }, []);

  return {
    pagination,
    setPage,
    setPageSize,
    setTotal,
    nextPage,
    prevPage,
    isFirstPage: pagination.page === 0,
    isLastPage: pagination.page >= pagination.totalPages - 1,
  };
};

import { useState, useMemo } from "react";

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return {
      currentItems,
      totalPages,
      currentPage,
      itemsPerPage,
      totalItems: data.length,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, data.length),
    };
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const firstPage = () => {
    goToPage(1);
  };

  const lastPage = () => {
    goToPage(paginationData.totalPages);
  };

  return {
    ...paginationData,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    hasNext: currentPage < paginationData.totalPages,
    hasPrev: currentPage > 1,
  };
};

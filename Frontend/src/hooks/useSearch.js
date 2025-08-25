import { useState, useMemo } from "react";
import { useDebounce } from "./useDebounce";

export const useSearch = (data = [], searchFields = [], options = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const {
    debounceMs = 300,
    caseSensitive = false,
    exactMatch = false,
  } = options;

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let result = data;

    // Apply text search
    if (debouncedSearchTerm && searchFields.length > 0) {
      const term = caseSensitive
        ? debouncedSearchTerm
        : debouncedSearchTerm.toLowerCase();

      result = result.filter((item) => {
        return searchFields.some((field) => {
          const fieldValue = getNestedValue(item, field);
          if (!fieldValue) return false;

          const value = caseSensitive
            ? String(fieldValue)
            : String(fieldValue).toLowerCase();

          return exactMatch ? value === term : value.includes(term);
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        result = result.filter((item) => {
          const itemValue = getNestedValue(item, key);
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    return result;
  }, [
    data,
    debouncedSearchTerm,
    filters,
    searchFields,
    caseSensitive,
    exactMatch,
  ]);

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filteredData,
    resultCount: filteredData.length,
    hasFilters: Object.keys(filters).length > 0 || searchTerm.length > 0,
  };
};

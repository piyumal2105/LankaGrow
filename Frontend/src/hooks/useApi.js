import { useState, useEffect, useCallback } from "react";
import { useNotification } from "../context/NotificationContext";

export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useNotification();

  const {
    showErrorNotification = true,
    initialLoad = true,
    transform,
  } = options;

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);
        let responseData = response.data;

        if (transform && typeof transform === "function") {
          responseData = transform(responseData);
        }

        setData(responseData);
        return { success: true, data: responseData };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMessage);

        if (showErrorNotification) {
          showError(errorMessage);
        }

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, transform, showError, showErrorNotification]
  );

  useEffect(() => {
    if (initialLoad) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

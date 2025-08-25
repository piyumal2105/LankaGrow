import { useState, useCallback } from "react";
import { useNotification } from "../context/NotificationContext";

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useNotification();

  const execute = useCallback(
    async (
      asyncFunction,
      {
        loadingMessage,
        successMessage,
        errorMessage,
        showNotifications = true,
        onSuccess,
        onError,
      } = {}
    ) => {
      try {
        setLoading(true);
        setError(null);

        let toastId;
        if (loadingMessage && showNotifications) {
          toastId = showLoading(loadingMessage);
        }

        const result = await asyncFunction();

        if (toastId) {
          dismissLoading(toastId);
        }

        if (successMessage && showNotifications) {
          showSuccess(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return { success: true, data: result };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMsg);

        if (errorMessage && showNotifications) {
          showError(errorMessage);
        } else if (showNotifications) {
          showError(errorMsg);
        }

        if (onError) {
          onError(err);
        }

        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess]
  );

  return {
    loading,
    error,
    execute,
    clearError: () => setError(null),
  };
};

import React, { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";

const NotificationContext = createContext();

const initialState = {
  notifications: [],
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification,
    };

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: newNotification,
    });

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  };

  const removeNotification = (id) => {
    dispatch({
      type: "REMOVE_NOTIFICATION",
      payload: id,
    });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  // Toast helpers
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: "hsl(142, 71%, 97%)",
        color: "hsl(142, 71%, 20%)",
        border: "1px solid hsl(142, 71%, 45%)",
      },
      ...options,
    });

    return addNotification({
      type: "success",
      message,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      duration: 6000,
      style: {
        background: "hsl(0, 72%, 97%)",
        color: "hsl(0, 72%, 20%)",
        border: "1px solid hsl(0, 72%, 51%)",
      },
      ...options,
    });

    return addNotification({
      type: "error",
      message,
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast(message, {
      duration: 5000,
      icon: "⚠️",
      style: {
        background: "hsl(38, 92%, 97%)",
        color: "hsl(38, 92%, 20%)",
        border: "1px solid hsl(38, 92%, 50%)",
      },
      ...options,
    });

    return addNotification({
      type: "warning",
      message,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast(message, {
      duration: 4000,
      icon: "ℹ️",
      style: {
        background: "hsl(199, 89%, 97%)",
        color: "hsl(199, 89%, 20%)",
        border: "1px solid hsl(199, 89%, 48%)",
      },
      ...options,
    });

    return addNotification({
      type: "info",
      message,
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      style: {
        background: "hsl(210, 40%, 98%)",
        color: "hsl(215, 16%, 47%)",
        border: "1px solid hsl(214, 32%, 91%)",
      },
      ...options,
    });
  };

  const dismissLoading = (toastId) => {
    toast.dismiss(toastId);
  };

  const value = {
    ...state,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

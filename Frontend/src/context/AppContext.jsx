import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // In real app, decode token to get user info
      setUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "admin",
      });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab("dashboard");
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    activeTab,
    setActiveTab,
    loading,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

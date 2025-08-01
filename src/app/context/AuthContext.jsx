"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredCurrentUser,
  saveCurrentUser,
  clearStorage,
} from "../data/mockDatabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage
    const currentUser = getStoredCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    saveCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearStorage();
    // In a real app, you'd redirect to login page here
    window.location.href = "/login";
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    saveCurrentUser(updatedUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isSuperuser: user?.role === "superuser",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

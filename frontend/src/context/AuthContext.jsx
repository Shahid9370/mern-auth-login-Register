/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 * - login({email, password, remember}) => calls POST /api/auth/login and expects { token, user }
 * - register(payload) => calls POST /api/auth/register
 * - logout() => clears state/localStorage
 *
 * NOTE: adapt endpoints/response parsing to match your backend.
 */

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth.user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth.token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem("auth.token", token);
    else localStorage.removeItem("auth.token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("auth.user", JSON.stringify(user));
    else localStorage.removeItem("auth.user");
  }, [user]);

  async function login({ email, password, remember = false }) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Expecting { token, user } - adjust if your backend returns different shape
      setToken(data.token);
      setUser(data.user || { email });
      // If remember === false you might want to avoid persistent storage; here we still store for demo.
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.message || "Login failed" };
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.message || "Registration failed" };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.user");
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
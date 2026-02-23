import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "inneed_auth_v1";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const persistAuth = (nextAuth) => {
    setAuth(nextAuth);
    if (nextAuth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const normalizeAuthPayload = (payload) => {
    return {
      token: payload.token,
      user: {
        id: payload._id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone || "",
        location: payload.location || "",
      },
    };
  };

  const login = async ({ email, password }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const nextAuth = normalizeAuthPayload(data);
    persistAuth(nextAuth);
    return nextAuth;
  };

  const register = async ({ name, email, password, role, location, phone }) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password, role, location, phone },
    });

    const nextAuth = normalizeAuthPayload(data);
    persistAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    persistAuth(null);
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || "",
      isAuthenticated: Boolean(auth?.token),
      login,
      register,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

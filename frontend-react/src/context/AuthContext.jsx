import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("ie_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mantiene la pestaña sincronizada si el token se borra/actualiza en otra
    const onStorage = (e) => {
      if (e.key === "ie_user") {
        setUser(readStoredUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(username, password);
      const loggedUser = {
        username: data.username,
        rol: data.rol,
        token: data.token,
        perfilCompleto: data.perfilCompleto,
        idPerfil: data.idPerfil,
        idUsuario: data.idUsuario,
      };
      localStorage.setItem("ie_token", data.token);
      localStorage.setItem("ie_user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const stored = readStoredUser();
      if (!stored) return null;
      const { data } = await authApi.getProfile();
      const updated = { ...stored, perfilCompleto: data.perfilCompleto, idPerfil: data.idPerfil, idUsuario: data.idUsuario };
      localStorage.setItem("ie_user", JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch {
      return readStoredUser();
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ie_token");
    localStorage.removeItem("ie_user");
    setUser(null);
  }, []);

  const value = {
    user,
    usuario: user,
    isAuthenticated: !!user,
    loading,
    login,
    refreshProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import http from "../services/http";
import { auth, authHttp } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "tz_tokens";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null;
    } catch {
      return null;
    }
  });

  const applyTokens = useCallback((t) => {
    if (t?.access) {
      http.defaults.headers.common.Authorization = `Bearer ${t.access}`;
      authHttp.defaults.headers.common.Authorization = `Bearer ${t.access}`;
    }
  }, []);

  const clearTokens = useCallback(() => {
    delete http.defaults.headers.common.Authorization;
    delete authHttp.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    applyTokens(tokens);
    if (!tokens?.access) {
      setLoading(false);
      return;
    }
    let active = true;
    auth
      .me()
      .then((u) => active && setUser(u))
      .catch(() => {
        if (active) {
          clearTokens();
          setTokens(null);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [tokens, applyTokens, clearTokens]);

  const persistTokens = useCallback((t) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
    setTokens(t);
    applyTokens(t);
  }, [applyTokens]);

  const login = useCallback(
    async (username, password) => {
      const res = await auth.login({ username, password });
      persistTokens(res);
      setUser(res.user);
      return res.user;
    },
    [persistTokens]
  );

  const register = useCallback(
    async (data) => {
      const res = await auth.register(data);
      persistTokens(res);
      setUser(res.user);
      return res.user;
    },
    [persistTokens]
  );

  const logout = useCallback(() => {
    clearTokens();
    setTokens(null);
    setUser(null);
  }, [clearTokens]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

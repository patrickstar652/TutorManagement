import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";
const TOKEN_KEY = "token";

const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  return token;
};

const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token 解碼失敗:", error);
    return null;
  }
};

const isTokenActive = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) {
    return false;
  }

  return decoded.exp >= Date.now() / 1000;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = getStoredToken();
    return isTokenActive(storedToken) ? storedToken : null;
  });

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const login = useCallback((nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  }, []);

  useEffect(() => {
    if (!isTokenActive(token)) {
      logout();
    }
  }, [logout, token]);

  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const value = useMemo(() => {
    const user = decodeToken(token);

    return {
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      token,
      user,
    };
  }, [login, logout, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

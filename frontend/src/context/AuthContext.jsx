import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const responseData = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshPromise = useRef(null);

  const refreshAccessToken = useCallback(() => {
    if (!refreshPromise.current) {
      refreshPromise.current = fetch(`${backendUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
        .then((response) => response.ok)
        .catch(() => false)
        .finally(() => {
          refreshPromise.current = null;
        });
    }
    return refreshPromise.current;
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      let response = await fetch(`${backendUrl}/api/auth/profile`, { credentials: 'include' });
      if (response.status === 401 && await refreshAccessToken()) {
        response = await fetch(`${backendUrl}/api/auth/profile`, { credentials: 'include' });
      }

      if (response.ok) {
        setUser(await responseData(response));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void checkAuthStatus();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [checkAuthStatus]);

  const authenticatedFetch = useCallback(async (input, init = {}) => {
    let response = await fetch(input, { ...init, credentials: 'include' });
    if (response.status !== 401) {
      return response;
    }

    if (!await refreshAccessToken()) {
      setUser(null);
      return response;
    }

    response = await fetch(input, { ...init, credentials: 'include' });
    if (response.status === 401) {
      setUser(null);
    }
    return response;
  }, [refreshAccessToken]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await responseData(response);
      if (!response.ok) {
        return { success: false, message: data.message || 'Unable to sign in.' };
      }
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, message: 'The server could not be reached.' };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });
      const data = await responseData(response);
      return response.ok
        ? { success: true, message: data.message }
        : { success: false, message: data.message || 'Unable to create an account.' };
    } catch {
      return { success: false, message: 'The server could not be reached.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authenticatedFetch, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

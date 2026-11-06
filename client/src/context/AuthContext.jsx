import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginRequest, register as registerRequest } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('rw_token');
    if (!token) {
      setLoading(false);
      return () => { active = false; };
    }

    getMe()
      .then(({ data }) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('rw_token');
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const saveSession = useCallback((data) => {
    if (data.token) localStorage.setItem('rw_token', data.token);
    setUser(data.user || null);
    return data.user;
  }, []);

  const signIn = useCallback(async (credentials) => {
    const { data } = await loginRequest(credentials);
    return saveSession(data);
  }, [saveSession]);

  const signUp = useCallback(async (details) => {
    const { data } = await registerRequest(details);
    return saveSession(data);
  }, [saveSession]);

  const signOut = useCallback(() => {
    localStorage.removeItem('rw_token');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, isAuthenticated: Boolean(user) }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

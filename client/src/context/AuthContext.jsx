import { createContext, useCallback, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../api/authApi';

/**
 * AuthContext
 * Provides { user, token, login, register, logout, loading } to the whole app.
 * Token is persisted in localStorage under the key "rw_token".
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('rw_token');
    if (!token) { setLoading(false); return; }

    getMe()
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('rw_token'))
      .finally(() => setLoading(false));
  }, []);

  // login(email, password) — throws on failure
  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin({ email, password });
    localStorage.setItem('rw_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // register(fields) — throws on failure
  const register = useCallback(async (fields) => {
    const { data } = await apiRegister(fields);
    localStorage.setItem('rw_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // logout
  const logout = useCallback(() => {
    localStorage.removeItem('rw_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

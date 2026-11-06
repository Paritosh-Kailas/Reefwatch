import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth()
 * Convenience hook — returns { user, loading, login, register, logout }
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

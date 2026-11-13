import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth()
 * Convenience hook — call this in any component instead of
 * importing AuthContext directly.
 *
 * Returns: { user, loading, login, register, logout }
 *
 * Example:
 *   const { user, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

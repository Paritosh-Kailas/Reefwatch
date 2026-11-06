import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * <ProtectedRoute>
 * Wraps any route that requires the user to be signed in.
 * If not authenticated → redirects to /login (preserving the intended URL
 * in location.state so we can redirect back after login).
 *
 * Usage in AppRoutes:
 *   <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While the auth context is still restoring the session, show nothing
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#061a22]">
        <span className="animate-pulse text-teal-400">Loading…</span>
      </div>
    );
  }

  if (!user) {
    // Not signed in — redirect to login, remember where we came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

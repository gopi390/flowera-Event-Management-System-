import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guards a route behind login, and optionally behind a specific role.
// Customers can never reach admin-only routes and vice versa.
export default function ProtectedRoute({ children, requireRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

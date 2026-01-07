import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'superadmin') {
      return <Navigate to="/dashboard/superadmin" replace />;
    } else if (user.role === 'organization') {
      return <Navigate to="/dashboard/organization" replace />;
    } else if (user.role === 'member') {
      return <Navigate to="/dashboard/member" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;


import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const ProtectedRoute = () => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
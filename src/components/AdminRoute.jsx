import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const AdminRoute = () => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn || role != "admin") {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
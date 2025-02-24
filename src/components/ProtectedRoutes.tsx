import { useAuth } from '../hooks/AuthProvider';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoutes = () => {
  const user = useAuth();
  if (!user?.user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

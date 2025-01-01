import { getCurrentUser } from '@/services/auth';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoutes = () => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

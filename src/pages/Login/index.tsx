import { useAuth } from '@/hooks/AuthProvider';
import { LoginForm } from './LoginForm';
import { Navigate } from 'react-router';

function Login() {
  const user = useAuth();
  if (user?.user) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Login;

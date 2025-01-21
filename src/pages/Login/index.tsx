import { useAuth } from '@/hooks/AuthProvider';
import { Navigate } from 'react-router';
import { LoginForm } from './LoginForm';

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

import { useAuth } from "@/provider/AuthProvider";
import { LoginForm } from "./LoginForm";
import { Navigate } from "react-router";

function Login() {
  const user = useAuth();
  console.log(user  );
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
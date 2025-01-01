import { getCurrentUser } from "@/services/auth";
import { LoginForm } from "./LoginForm";
import { Navigate } from "react-router";

function Login() {
  if (getCurrentUser()) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default Login;
import User from "@/types/user";
import axios from "axios";
import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginData {
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (data: LoginData) => Promise<void>;
    logOut: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null);
    const login = async (data: LoginData) => {
        return axios
        .post(API_URL + "login", {
            email: data.email,
            password: data.password
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
            }

            return response.data;
        });
    };
    const logOut = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };
    const contextValue = {
        user,
        login,
        logOut,
    };
    return <AuthContext.Provider value={ contextValue }> { children } </AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
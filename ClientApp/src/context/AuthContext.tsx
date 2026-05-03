import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthResponseDto,
  AuthUser,
  LoginDto,
  RegisterDto,
  Result,
} from "../types";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: AuthUser | null;
  authToken: AuthResponseDto | null;
  loading: boolean;
  setAuthToken: (t: AuthResponseDto | null) => void;
  setUser: (u: AuthUser | null) => void;

  login: (data: LoginDto) => Promise<Result>;
  logout: () => Promise<void>;
  register: (data: RegisterDto) => Promise<Result>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<AuthResponseDto | null>(() => {
    const stored = localStorage.getItem("authToken");
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("authToken");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed?.accessToken ? jwtDecode(parsed.accessToken) : null;
  });
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (data: LoginDto): Promise<Result> => {
    try {
      setLoading(true);
      const res = await authService.Login(data);
      if (res.isSuccess && res.data) {
        setAuthToken({
          accessToken: res.data.accessToken,
          role: res.data.role,
          userName: res.data.userName,
        });
        setUser(jwtDecode(res.data.accessToken));
        localStorage.setItem(
          "authToken",
          JSON.stringify({
            accessToken: res.data.accessToken,
            role: res.data.role,
            userName: res.data.userName,
          }),
        );

        localStorage.setItem(
          "authToken",
          JSON.stringify({
            accessToken: res.data.accessToken,
            role: res.data.role,
            userName: res.data.userName,
          }),
        );
        return { message: "Login Success", isSuccess: true };
      }

      return { message: res.message || "Login Failed", isSuccess: false };
    } catch {
      return {
        message: "Invalid Username or Password",
        isSuccess: false,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.Logout();
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setAuthToken(null);
    }
  }, []);

  const register = useCallback(async (data: RegisterDto): Promise<Result> => {
    try {
      setLoading(true);
      const res = await authService.Register(data);
      if(res.isSuccess)
      return { message: "Register Success", isSuccess: true };
      
      return { message: res.message, isSuccess: false };
    } catch {
      return {
        message: "Server Error try again later",
        isSuccess: false,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("authToken");

    if (stored) {
      const parsed = JSON.parse(stored);
      setAuthToken(parsed);
      setUser(jwtDecode(parsed.accessToken));
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        loading,
        setUser,
        setAuthToken,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { setToken } from "../api/tokenRef";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginDto) => Promise<Result>;
  register: (data: RegisterDto) => Promise<Result>;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!accessToken;

  const login = useCallback(async (data: LoginDto): Promise<Result> => {
    try {
      setLoading(true);
      const res = await authService.Login(data);
      setAccessToken(res.accessToken);
      setToken(res.accessToken);
      setUser({
        userName: res.userName,
        role: res.role,
      });
      return { message: "Login Success", isSuccess: true };
    } catch (error: any) {
      return {
        message: String(error),
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
      setUser(null);
      setAccessToken(null);
      setToken(null);
    }
  }, []);

  const register = useCallback(async (data: RegisterDto): Promise<Result> => {
    try {
      setLoading(true);
      await authService.Register(data);
      return { message: "Register Success", isSuccess: true };
    } catch {
      return {
        message: "Server Error try again leater",
        isSuccess: false,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res: AuthResponseDto = await authService.Refresh();
        setToken(res.accessToken);
        setAccessToken(res.accessToken);
        setUser({ userName: res.userName, role: res.role });
      } catch {
        setUser(null);
        setAccessToken(null);
      }
    };
    refresh();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

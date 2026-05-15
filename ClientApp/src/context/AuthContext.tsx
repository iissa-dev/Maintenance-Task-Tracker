import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthUser,
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  Result,
} from "../types";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const login = useCallback(async (data: LoginDto): Promise<Result> => {
    try {
      setLoading(true);
      const res = await authService.Login(data);
      if (res.isSuccess && res.data) {
        setAuthToken({
          userId: res.data.userId,
          accessToken: res.data.accessToken,
          role: res.data.role,
          userName: res.data.userName,
        });
        setUser(jwtDecode(res.data.accessToken));

        localStorage.setItem(
          "authToken",
          JSON.stringify({
            userId: res.data.userId,
            accessToken: res.data.accessToken,
            role: res.data.role,
            userName: res.data.userName,
          }),
        );

        queryClient.clear();
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
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authService.Logout();
      queryClient.clear();
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setAuthToken(null);
    }
  }, [queryClient]);

  const register = useCallback(async (data: RegisterDto): Promise<Result> => {
    try {
      setLoading(true);
      const res = await authService.Register(data);
      if (res.isSuccess)
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

  // Listener for whatch the changes in memory
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if(e.key === "authToken" )
      {
        if(e.newValue === null)
        {
          setUser(null);
          setAuthToken(null);
          queryClient.clear();
        } else {
          // If someone change the token manually
          window.location.reload();
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [queryClient])
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

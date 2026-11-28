import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SESSION_EXPIRED_EVENT } from "@/api/client";

export interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string | null;
  login: (value: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("jwt"),
  );

  const login = useCallback((token: string) => {
    localStorage.setItem("jwt", token);
    setAuthToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    setAuthToken(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
      toast.info("Your session has expired. Please log in again.", {
        toastId: "session-expired",
      });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () =>
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [logout]);

  const value = useMemo(
    (): AuthContextType => ({
      isLoggedIn: Boolean(authToken),
      authToken,
      login,
      logout,
    }),
    [authToken, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
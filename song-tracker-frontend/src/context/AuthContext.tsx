import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string | null;
  login: (value: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
  }, []);

  const value = useMemo(
    () => ({
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

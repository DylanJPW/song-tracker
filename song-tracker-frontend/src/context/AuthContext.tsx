import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface User {
  username: string;
}

interface LoginProps {
  token: string;
  user: User;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string | null;
  login: (value: LoginProps) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("jwt"),
  );
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(({ token, user }: LoginProps) => {
    localStorage.setItem("jwt", token);
    setAuthToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt");
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(authToken),
      authToken,
      login,
      logout,
      user,
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

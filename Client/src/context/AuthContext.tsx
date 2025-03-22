import { createContext, useState, useEffect, ReactNode } from "react";

// Define Type for AuthContext
interface AuthContextType {
  user: { token: string } | null;
  setUser: (user: { token: string } | null) => void;
  logout: () => void;
}

// Create AuthContext with Default Value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ token: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      setUser({ token: storedToken });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

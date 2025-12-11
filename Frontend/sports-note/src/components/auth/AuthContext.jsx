import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("https://sports-note-backend.onrender.com/api/auth/session", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    setLogoutLoading(true);

    await axios.post("https://sports-note-backend.onrender.com/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setLogoutLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, logoutLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Created AuthContext to share authentication data across the wen-app
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // State for user info, loading states, and refresh triggers

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     try {
  //       const res = await axios.get("https://sports-note-backend.onrender.com/api/auth/session", { withCredentials: true });
  //       setUser(res.data.user);
  //     } catch {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSession();
  // }, []);


  // Load user from localStorage on app start to keep them logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
  // const login = (userData) => setUser(userData); 

   // Login function saves user and token in localStorage and updates state
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };


  // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
  // const logout = async () => {
  //   setLogoutLoading(true);

  //   await axios.post("https://sports-note-backend.onrender.com/api/auth/logout", {}, { withCredentials: true });
  //   setUser(null);
  //   setLogoutLoading(false);
  // };


  // Logout function removes user info from localStorage and resets state
  const logout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setLogoutLoading(false);
    }, 2000);
  };
  
  // Provide all auth data and functions to children components
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, logoutLoading, refreshKey, triggerRefresh}}>
      {children}
    </AuthContext.Provider>
  );
}
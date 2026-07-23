import { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../services/storage";
import { loginOfficer, loginNira } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());

  // Sync state changes with localStorage
  useEffect(() => {
    storage.setUser(user);
  }, [user]);

  // Standard Login Action
  const login = async (username, password) => {
    const response = await loginOfficer(username, password);

    if (response.success) {
      setUser(response.userData);
      if (response.rawResponse) {
        storage.setAuxiliaryData(response.rawResponse);
      }
    }

    return response;
  };

  // NIRA Login Action
  const niraLogin = async (username, password) => {
    const response = await loginNira(username, password);

    if (response.success) {
      setUser(response.userData);
    }

    return response;
  };

  // Local Registration Action
  const register = (username, role = "officer") => {
    const userData = { username, role };
    setUser(userData);
  };

  // Logout Action
  const logout = () => {
    setUser(null);
    storage.clearAll();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, niraLogin, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
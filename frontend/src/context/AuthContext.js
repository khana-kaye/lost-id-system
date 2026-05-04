import { createContext, useContext, useState } from "react";

// Use a deployed API URL by default; override with REACT_APP_API_URL for local testing.
const API_BASE = process.env.REACT_APP_API_URL || "https://lost-id-system.onrender.com/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ username: data.username, role: "officer" });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Auth login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
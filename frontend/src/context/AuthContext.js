import { createContext, useContext, useState } from "react";

// Use a deployed API URL by default; override with REACT_APP_API_URL for local testing.
const API_BASE = "https://lost-id-system.onrender.com/api";
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

      const data = await res.json().catch(() => ({ message: "Unknown error" }));

      if (res.ok) {
        setUser({ username: data.username, role: "officer" });
        return { success: true, message: data.message || "Login successful" };
      }

      return { success: false, message: data.message || "Invalid credentials" };
    } catch (error) {
      console.error("Auth login error:", error);
      return { success: false, message: "Network or backend error" };
    }
  };

  const logout = () => {
    setUser(null);
    
  };

  const register = (username, role = "officer") => {
    setUser({ username, role });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
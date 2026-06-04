import { createContext, useContext, useState, useEffect } from "react";
import API_BASE from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }, [user]);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        const userData = {
          username: data.username,
          role: "officer",
          staff_id: data.staff_id,
          rank: data.rank,
          station: data.station,
          email: data.email || "",
        };

        setUser(userData);

        if (data.staff_id) {
          localStorage.setItem("staff_id", data.staff_id);
        }
        if (data.username) {
          localStorage.setItem("username", data.username);
        }
        if (data.rank) {
          localStorage.setItem("rank", data.rank);
        }
        if (data.station) {
          localStorage.setItem("station", data.station);
        }
        if (data.email) {
          localStorage.setItem("email", data.email);
        }

        return {
          success: true,
          message: data.message || "Login successful",
          ...data,
        };
      }

      return {
        success: false,
        message:
          data?.message || data?.detail || res.statusText || "Invalid credentials",
      };

    } catch (error) {
      console.error("Auth login error:", error);
      return {
        success: false,
        message: error?.message || "Network or backend error",
      };
    }
  };



  //       setUser({ username: data.username, role: "officer" });
  //       return { success: true, message: data.message || "Login successful" };
  //     }

  //     return { success: false, message: data.message || "Invalid credentials" };
  //   } catch (error) {
  //     console.error("Auth login error:", error);
  //     return { success: false, message: "Network or backend error" };
  //   }
  // };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      "staff_id"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "rank"
    );

    localStorage.removeItem(
      "station"
    );

    localStorage.removeItem(
      "email"
    );

    sessionStorage.clear();
  };
    
  

  const register = (username, role = "officer") => {
    setUser({ username, role });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
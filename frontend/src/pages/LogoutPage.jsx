import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const { logout } = useAuth(); // you must have this in your AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    // 1. clear auth
    if (logout) {
      logout();
    } else {
      // fallback if you don't have logout function yet
      localStorage.removeItem("user");
    }

    // 2. redirect to login
    navigate("/login");
  }, [logout, navigate]);

  return (
    <div style={container}>
      Logging out...
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  color: "#6b7280",
};

export default LogoutPage;
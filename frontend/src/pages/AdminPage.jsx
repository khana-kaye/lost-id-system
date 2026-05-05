import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <PageLayout>
        <div style={guestContainer}>
          <div style={guestCard}>
            <h2 style={guestTitle}>🔐 Access Denied</h2>
            <p style={guestSubtitle}>You are not authorized to access the police portal.</p>

            <div style={guestActions}>
              <button style={guestButton} onClick={() => navigate("/")}>
                Go to Home
              </button>
              <button style={{ ...guestButton, background: theme.secondary }} onClick={() => navigate("/login") }>
                Officer Login
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={dashboardPage}>
        <div style={dashboardHeader}>
          <div>
            <h1 style={dashboardTitle}>Officer / Admin Portal</h1>
            <p style={dashboardSubtitle}>Manage lost and found ID records securely.</p>
          </div>
        </div>

        <div style={dashboardGrid}>
          <div style={cardStyle}>
            <h3 style={cardTitle}>➕ Add Found ID</h3>
            <p style={cardText}>Register a newly found National ID or Driver's Permit.</p>
            <button style={buttonStyle} onClick={() => navigate("/admin/add") }>
              Open
            </button>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitle}>🔍 Search Database</h3>
            <p style={cardText}>Search lost or found IDs using name or ID number.</p>
            <button style={buttonStyle} onClick={() => navigate("/admin/search") }>
              Open
            </button>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitle}>📄 View Reports</h3>
            <p style={cardText}>See all submitted lost and found reports.</p>
            <button style={buttonStyle} onClick={() => navigate("/admin/reports") }>
              Open
            </button>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitle}>🛠 Manage Records</h3>
            <p style={cardText}>Edit or delete incorrect or outdated entries.</p>
            <button style={buttonStyle} onClick={() => navigate("/admin/manage") }>
              Open
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const guestContainer = {
  width: "100%",
  maxWidth: "520px",
  margin: "0 auto",
  padding: "24px",
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const guestCard = {
  width: "100%",
  background: theme.card,
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.16)",
  textAlign: "center",
};

const guestTitle = {
  margin: 0,
  fontSize: "28px",
  color: theme.dark,
};

const guestSubtitle = {
  color: "#6b7280",
  margin: "12px 0 24px",
};

const guestActions = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const guestButton = {
  minWidth: "160px",
  padding: "12px 18px",
  borderRadius: "16px",
  border: "none",
  background: theme.primary,
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

const dashboardPage = {
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
};

const dashboardHeader = {
  marginBottom: "32px",
};

const dashboardTitle = {
  margin: 0,
  fontSize: "36px",
  color: theme.dark,
};

const dashboardSubtitle = {
  margin: "10px 0 0",
  color: "white",
  maxWidth: "680px",
};

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: theme.card,
  padding: "24px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.16)",
};

const cardTitle = {
  margin: 0,
  marginBottom: "12px",
  fontSize: "20px",
  color: theme.dark,
};

const cardText = {
  color: "#6b7280",
  lineHeight: "1.7",
};

const buttonStyle = {
  marginTop: "22px",
  padding: "14px 18px",
  minWidth: "120px",
  borderRadius: "16px",
  border: "none",
  background: theme.primary,
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

export default AdminPage;

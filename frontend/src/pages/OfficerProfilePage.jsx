import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";

function OfficerProfilePage() {
  const navigate = useNavigate();

  // ── mock officer data ─────────────────────────────
  const officer = {
    name: "Officer Sarah Nalule",
    serviceNumber: "UPF-20481",
    rank: "Inspector",
    station: "Kampala Central Police Station",
    role: "Police Officer",
    email: "sarah.nalule@upf.go.ug",
    phone: "+256 700 123456",
    joined: "12 March 2023",
    status: "Active",
    lastLogin: "10 May 2026 • 09:14 AM",

    stats: {
      reportsHandled: 284,
      idsRecovered: 91,
      flaggedCases: 12,
      forwardedCases: 44,
    },
  };

  const initials = officer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageLayout>
      <div style={pageWrapper}>

        {/* ── header ───────────────────────────── */}
        <div style={header}>

          <div>
            <h1 style={title}>
              👤 Officer Profile
            </h1>

            <p style={subtitle}>
              View officer identity and account information.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>

        </div>

        {/* ── top profile card ─────────────────── */}
        <div style={profileCard}>

          <div style={avatar}>
            {initials}
          </div>

          <div style={{ flex: 1 }}>

            <div style={officerName}>
              {officer.name}
            </div>

            <div style={officerMeta}>
              {officer.rank} • {officer.station}
            </div>

            <div style={badgeRow}>

              <span style={statusBadge}>
                {officer.status}
              </span>

              <span style={roleBadge}>
                {officer.role}
              </span>

            </div>

          </div>

        </div>

        {/* ── grid ─────────────────────────────── */}
        <div style={grid}>

          {/* ── personal info ───────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              Personal Information
            </div>

            <div style={cardBody}>

              <InfoRow
                label="Full Name"
                value={officer.name}
              />

              <InfoRow
                label="Service Number"
                value={officer.serviceNumber}
              />

              <InfoRow
                label="Rank"
                value={officer.rank}
              />

              <InfoRow
                label="Police Station"
                value={officer.station}
              />

            </div>
          </div>

          {/* ── contact info ────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              Contact Information
            </div>

            <div style={cardBody}>

              <InfoRow
                label="Official Email"
                value={officer.email}
              />

              <InfoRow
                label="Phone Number"
                value={officer.phone}
              />

              <InfoRow
                label="Last Login"
                value={officer.lastLogin}
              />

              <InfoRow
                label="Joined"
                value={officer.joined}
              />

            </div>
          </div>

          {/* ── stats ───────────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              Activity Summary
            </div>

            <div style={statsGrid}>

              <StatCard
                label="Reports"
                value={officer.stats.reportsHandled}
              />

              <StatCard
                label="Recovered IDs"
                value={officer.stats.idsRecovered}
              />

              <StatCard
                label="Flagged Cases"
                value={officer.stats.flaggedCases}
              />

              <StatCard
                label="Forwarded"
                value={officer.stats.forwardedCases}
              />

            </div>
          </div>

          {/* ── security ────────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              Security
            </div>

            <div style={cardBody}>

              <button style={actionBtn}>
                Change Password
              </button>

              <button style={secondaryBtn}>
                Enable 2FA
              </button>

              <button style={secondaryBtn}>
                View Login Activity
              </button>

            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}

// ── info row ───────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div style={infoRow}>
      <div style={infoLabel}>
        {label}
      </div>

      <div style={infoValue}>
        {value}
      </div>
    </div>
  );
}

// ── stat card ──────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statValue}>
        {value}
      </div>

      <div style={statLabel}>
        {label}
      </div>
    </div>
  );
}

// ── styles ─────────────────────────────────────────

const pageWrapper = {
  maxWidth: "1250px",
  margin: "0 auto",
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  gap: "12px",
  flexWrap: "wrap",
};

const title = {
  margin: 0,
  fontSize: "32px",
  color: theme.dark,
};

const subtitle = {
  marginTop: "8px",
  color: "#6b7280",
};

const backBtn = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
};

const profileCard = {
  background: theme.card,
  borderRadius: "22px",
  padding: "28px",
  display: "flex",
  gap: "20px",
  alignItems: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  marginBottom: "24px",
};

const avatar = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background: theme.primary + "22",
  color: theme.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  fontWeight: "700",
  flexShrink: 0,
};

const officerName = {
  fontSize: "28px",
  fontWeight: "700",
  color: theme.dark,
};

const officerMeta = {
  marginTop: "6px",
  color: "#6b7280",
};

const badgeRow = {
  display: "flex",
  gap: "10px",
  marginTop: "14px",
  flexWrap: "wrap",
};

const statusBadge = {
  background: "#e8f5e9",
  color: "#2e7d32",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const roleBadge = {
  background: "#e3f2fd",
  color: "#1565c0",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

const card = {
  background: theme.card,
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const cardHeader = {
  padding: "18px 20px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  fontSize: "15px",
  fontWeight: "700",
  color: theme.dark,
};

const cardBody = {
  padding: "20px",
};

const infoRow = {
  marginBottom: "18px",
};

const infoLabel = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "4px",
};

const infoValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: theme.dark,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "14px",
  padding: "20px",
};

const statCard = {
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "18px",
};

const statValue = {
  fontSize: "28px",
  fontWeight: "700",
  color: theme.dark,
};

const statLabel = {
  marginTop: "6px",
  fontSize: "12px",
  color: "#6b7280",
};

const actionBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  marginBottom: "12px",
};

const secondaryBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  marginBottom: "12px",
};

export default OfficerProfilePage;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function BankProfilePage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const staffId = localStorage.getItem("staff_id");

      if (!staffId) {
        setError("No bank staff logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/bank/profile/${staffId}/`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load profile");

        setStaff({
          name: data.username,
          staffId: data.staff_id,
          bankName: data.bank_name,
          branch: data.branch,
          role: data.role || "Bank Staff",
          status: "Active",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <PageLayout><div style={pageWrapper}>Loading bank profile...</div></PageLayout>;

  if (error || !staff) {
    return (
      <PageLayout>
        <div style={pageWrapper}>
          <h1 style={title}>🏦 Bank Profile</h1>
          <p style={subtitle}>{error || "Profile not found."}</p>
          <button style={backBtn} onClick={() => navigate("/bank/dashboard")}>← Backkk</button>
        </div>
      </PageLayout>
    );
  }

  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageLayout>
      <div style={pageWrapper}>
        <div style={header}>
          <div>
            <h1 style={title}>🏦 Bank Profile</h1>
            <p style={subtitle}>View bank staff identity and account information.</p>
          </div>
        </div>

        <div style={profileCard}>
          <div style={avatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={staffName}>{staff.name}</div>
            <div style={staffMeta}>{staff.bankName} • {staff.branch}</div>
            <div style={badgeRow}>
              <span style={statusBadge}>{staff.status}</span>
              <span style={roleBadge}>{staff.role}</span>
            </div>
          </div>
        </div>

        <div style={grid}>
          <div style={card}>
            <div style={cardHeader}>Staff Information</div>
            <div style={cardBody}>
              <InfoRow label="Username" value={staff.name} />
              <InfoRow label="Staff ID" value={staff.staffId} />
              <InfoRow label="Bank Name" value={staff.bankName} />
              <InfoRow label="Branch" value={staff.branch} />
              <InfoRow label="Role" value={staff.role} />
              <InfoRow label="Status" value={staff.status} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={infoRow}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value}</div>
    </div>
  );
}

const pageWrapper = { maxWidth: "1250px", margin: "0 auto", padding: "24px" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap" };
const title = { margin: 0, fontSize: "32px", color: theme.dark };
const subtitle = { marginTop: "8px", color: "#6b7280" };
const backBtn = { padding: "12px 18px", borderRadius: "12px", border: "none", background: theme.primary, color: "#fff", cursor: "pointer", fontWeight: "700" };
const profileCard = { background: theme.card, borderRadius: "22px", padding: "28px", display: "flex", gap: "20px", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "24px" };
const avatar = { width: "90px", height: "90px", borderRadius: "50%", background: theme.primary + "22", color: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "700" };
const staffName = { fontSize: "28px", fontWeight: "700", color: theme.dark };
const staffMeta = { marginTop: "6px", color: "#6b7280" };
const badgeRow = { display: "flex", gap: "10px", marginTop: "14px" };
const statusBadge = { background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" };
const roleBadge = { background: "#e3f2fd", color: "#1565c0", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" };
const card = { background: theme.card, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" };
const cardHeader = { padding: "18px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: "700" };
const cardBody = { padding: "20px" };
const infoRow = { marginBottom: "18px" };
const infoLabel = { fontSize: "12px", color: "#6b7280" };
const infoValue = { fontSize: "14px", fontWeight: "600", color: theme.dark };

export default BankProfilePage;
// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import PageLayout from "../../components/PageLayout";
// // import { theme } from "../../theme";
// // import BASE_URL from "../../api";

// // function BankProfilePage({ embedded }) {
// //   const navigate  = useNavigate();
// //   const [bankUser, setBankUser] = useState(null);
// //   const [loading,  setLoading]  = useState(true);
// //   const [error,    setError]    = useState("");

// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const staffId = localStorage.getItem("staff_id");
// //         if (!staffId) throw new Error("No bank staff logged in");

// //         const res  = await fetch(`${BASE_URL}/bank/profile/${staffId}/`);
// //         const data = await res.json();

// //         if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

// //         setBankUser(data);
// //       } catch (err) {
// //         console.error(err);
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchProfile();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <PageLayout>
// //         <div style={pageWrapper}>Loading profile...</div>
// //       </PageLayout>
// //     );
// //   }

// //   if (error || !bankUser) {
// //     return (
// //       <PageLayout>
// //         <div style={pageWrapper}>
// //           <h2 style={{ color: theme.dark }}>{error || "Profile not found"}</h2>
// //         </div>
// //       </PageLayout>
// //     );
// //   }

// //   // safe initials — handles single-word usernames too
// //   const initials = bankUser.username
// //     .split(" ")
// //     .map((n) => n[0])
// //     .join("")
// //     .slice(0, 2)
// //     .toUpperCase();

// //   const content = (
// //     <div style={pageWrapper}>

// //       {/* header */}
// //       <div style={headerRow}>
// //         <div>
// //           <h1 style={title}>🏦 Bank Staff Profile</h1>
// //           <p style={subtitle}>View bank staff information.</p>
// //         </div>
// //         <button style={backBtn} onClick={() => navigate("/bank/dashboard")}>
// //           ← Back
// //         </button>
// //       </div>

// //       {/* profile card */}
// //       <div style={profileCard}>
// //         <div style={avatar}>{initials}</div>
// //         <div>
// //           <div style={name}>{bankUser.username}</div>
// //           <div style={meta}>
// //             {bankUser.bank_name} • {bankUser.branch}
// //           </div>
// //           <div style={badgeRow}>
// //             <span style={statusBadge}>{bankUser.status}</span>
// //             <span style={roleBadge}>{bankUser.role}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* info + stats grid */}
// //       <div style={grid}>

// //         {/* personal info */}
// //         <div style={card}>
// //           <div style={cardHeader}>Personal Information</div>
// //           <div style={cardBody}>
// //             <InfoRow label="Full Name" value={bankUser.username} />
// //             <InfoRow label="Staff ID"  value={bankUser.staff_id} />
// //             <InfoRow label="Bank Name" value={bankUser.bank_name} />
// //             <InfoRow label="Branch"    value={bankUser.branch} />
// //           </div>
// //         </div>

// //         {/* activity summary */}
// //         <div style={card}>
// //           <div style={cardHeader}>Activity Summary</div>
// //           <div style={statsGrid}>
// //             <StatCard label="Reports"  value={bankUser.stats?.reportsHandled ?? 0} />
// //             <StatCard label="Resolved" value={bankUser.stats?.resolvedCases  ?? 0} />
// //             <StatCard label="Pending"  value={bankUser.stats?.pendingCases   ?? 0} />
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );

// //   // support both embedded and standalone modes
// //   return embedded ? content : <PageLayout>{content}</PageLayout>;
// // }

// // // ── sub-components ────────────────────────────────────────────
// // function InfoRow({ label, value }) {
// //   return (
// //     <div style={infoRow}>
// //       <div style={infoLabel}>{label}</div>
// //       <div style={infoValue}>{value ?? "—"}</div>
// //     </div>
// //   );
// // }

// // function StatCard({ label, value }) {
// //   return (
// //     <div style={statCard}>
// //       <div style={statValue}>{value}</div>
// //       <div style={statLabel}>{label}</div>
// //     </div>
// //   );
// // }

// // // ── styles ─────────────────────────────────────────────────────
// // const pageWrapper = {
// //   maxWidth: "1000px",
// //   margin: "0 auto",
// //   padding: "24px",
// // };
// // const headerRow = {
// //   display: "flex",
// //   justifyContent: "space-between",
// //   alignItems: "center",
// //   marginBottom: "24px",
// //   flexWrap: "wrap",
// //   gap: "12px",
// // };
// // const title    = { margin: 0, fontSize: "28px", fontWeight: "800", color: theme.dark };
// // const subtitle = { marginTop: "6px", color: "#6b7280" };
// // const backBtn  = {
// //   padding: "12px 18px",
// //   borderRadius: "12px",
// //   border: "none",
// //   background: theme.primary,
// //   color: "#fff",
// //   cursor: "pointer",
// //   fontWeight: "700",
// // };
// // const profileCard = {
// //   display: "flex",
// //   alignItems: "center",
// //   gap: "20px",
// //   background: theme.card,
// //   borderRadius: "20px",
// //   padding: "24px",
// //   marginBottom: "24px",
// //   boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
// // };
// // const avatar = {
// //   width: "64px",
// //   height: "64px",
// //   borderRadius: "50%",
// //   background: theme.primary,
// //   color: "#fff",
// //   display: "flex",
// //   alignItems: "center",
// //   justifyContent: "center",
// //   fontSize: "22px",
// //   fontWeight: "800",
// //   flexShrink: 0,
// // };
// // const name    = { fontSize: "20px", fontWeight: "700", color: theme.dark };
// // const meta    = { color: "#6b7280", marginTop: "4px", fontSize: "14px" };
// // const badgeRow = { display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" };
// // const statusBadge = {
// //   padding: "4px 12px",
// //   borderRadius: "20px",
// //   background: "#d1fae5",
// //   color: "#065f46",
// //   fontSize: "12px",
// //   fontWeight: "600",
// // };
// // const roleBadge = {
// //   padding: "4px 12px",
// //   borderRadius: "20px",
// //   background: "#dbeafe",
// //   color: "#1e40af",
// //   fontSize: "12px",
// //   fontWeight: "600",
// // };
// // const grid = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
// //   gap: "20px",
// // };
// // const card = {
// //   background: theme.card,
// //   borderRadius: "20px",
// //   overflow: "hidden",
// //   boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
// // };
// // const cardHeader = {
// //   padding: "16px 20px",
// //   fontWeight: "700",
// //   fontSize: "15px",
// //   color: theme.dark,
// //   borderBottom: "1px solid rgba(0,0,0,0.06)",
// // };
// // const cardBody = { padding: "8px 0" };
// // const infoRow  = {
// //   display: "flex",
// //   justifyContent: "space-between",
// //   padding: "12px 20px",
// //   borderBottom: "1px solid rgba(0,0,0,0.04)",
// // };
// // const infoLabel = { color: "#6b7280", fontSize: "13px" };
// // const infoValue = { fontWeight: "600", color: theme.dark, fontSize: "13px" };
// // const statsGrid = {
// //   display: "grid",
// //   gridTemplateColumns: "repeat(3, 1fr)",
// //   gap: "1px",
// //   background: "rgba(0,0,0,0.06)",
// // };
// // const statCard  = {
// //   background: theme.card,
// //   padding: "20px",
// //   textAlign: "center",
// // };
// // const statValue = { fontSize: "26px", fontWeight: "800", color: theme.dark };
// // const statLabel = { fontSize: "12px", color: "#6b7280", marginTop: "4px" };

// // export default BankProfilePage;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PageLayout from "../../components/PageLayout";
// import { theme } from "../../theme";
// import { useAuth } from "../../context/AuthContext";
// import BASE_URL from "../../api";

// function BankProfilePage() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [staff, setStaff] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user?.username) {
//         setError("No bank staff logged in.");
//         console.log("AUTH USER:", user);
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `${BASE_URL}/bank/${encodeURIComponent(user.username)}/`
//         );

//         if (!response.ok) {
//           const data = await response.json().catch(() => null);
//           throw new Error(data?.message || "Failed to load profile");
//         }

//         const data = await response.json();

//         setStaff({
//           name: data.username,
//           staffId: data.staff_id,
//           bankName: data.bank_name,
//           branch: data.branch,
//           role: data.role || "Bank Staff",
//           status: "Active",
//         });
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [user]);

//   if (loading) {
//     return (
//       <PageLayout>
//         <div style={pageWrapper}>
//           <p>Loading bank profile...</p>
//         </div>
//       </PageLayout>
//     );
//   }

//   if (error || !staff) {
//     return (
//       <PageLayout>
//         <div style={pageWrapper}>
//           <h1 style={title}>🏦 Bank Profile</h1>
//           <p style={subtitle}>{error || "Profile not found."}</p>
//         </div>
//       </PageLayout>
//     );
//   }

//   const initials = staff.name
//     ? staff.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .slice(0, 2)
//         .toUpperCase()
//     : "";

//   return (
//     <PageLayout>
//       <div style={pageWrapper}>

//         {/* HEADER */}
//         <div style={header}>
//           <div>
//             <h1 style={title}>🏦 Bank Profile</h1>
//             <p style={subtitle}>
//               View bank staff identity and account information.
//             </p>
//           </div>

//           <button style={backBtn} onClick={() => navigate("/bank/dashboard")}>
//             ← Back
//           </button>
//         </div>

//         {/* PROFILE CARD */}
//         <div style={profileCard}>
//           <div style={avatar}>{initials}</div>

//           <div style={{ flex: 1 }}>
//             <div style={staffName}>{staff.name}</div>

//             <div style={staffMeta}>
//               {staff.bankName} • {staff.branch}
//             </div>

//             <div style={badgeRow}>
//               <span style={statusBadge}>{staff.status}</span>
//               <span style={roleBadge}>{staff.role}</span>
//             </div>
//           </div>
//         </div>

//         {/* GRID */}
//         <div style={grid}>
//           <div style={card}>
//             <div style={cardHeader}>Staff Information</div>

//             <div style={cardBody}>
//               <InfoRow label="Username" value={staff.name} />
//               <InfoRow label="Staff ID" value={staff.staffId} />
//               <InfoRow label="Bank Name" value={staff.bankName} />
//               <InfoRow label="Branch" value={staff.branch} />
//               <InfoRow label="Role" value={staff.role} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   );
// }

// // reusable row
// function InfoRow({ label, value }) {
//   return (
//     <div style={infoRow}>
//       <div style={infoLabel}>{label}</div>
//       <div style={infoValue}>{value}</div>
//     </div>
//   );
// }

// //////////////////// STYLES ////////////////////

// const pageWrapper = {
//   maxWidth: "1250px",
//   margin: "0 auto",
//   padding: "24px",
// };

// const header = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: "24px",
//   flexWrap: "wrap",
// };

// const title = {
//   margin: 0,
//   fontSize: "32px",
//   color: theme.dark,
// };

// const subtitle = {
//   marginTop: "8px",
//   color: "#6b7280",
// };

// const backBtn = {
//   padding: "12px 18px",
//   borderRadius: "12px",
//   border: "none",
//   background: theme.primary,
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: "700",
// };

// const profileCard = {
//   background: theme.card,
//   borderRadius: "22px",
//   padding: "28px",
//   display: "flex",
//   gap: "20px",
//   alignItems: "center",
//   boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//   marginBottom: "24px",
// };

// const avatar = {
//   width: "90px",
//   height: "90px",
//   borderRadius: "50%",
//   background: theme.primary + "22",
//   color: theme.primary,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "28px",
//   fontWeight: "700",
// };

// const staffName = {
//   fontSize: "28px",
//   fontWeight: "700",
//   color: theme.dark,
// };

// const staffMeta = {
//   marginTop: "6px",
//   color: "#6b7280",
// };

// const badgeRow = {
//   display: "flex",
//   gap: "10px",
//   marginTop: "14px",
// };

// const statusBadge = {
//   background: "#e8f5e9",
//   color: "#2e7d32",
//   padding: "6px 12px",
//   borderRadius: "999px",
//   fontSize: "12px",
//   fontWeight: "700",
// };

// const roleBadge = {
//   background: "#e3f2fd",
//   color: "#1565c0",
//   padding: "6px 12px",
//   borderRadius: "999px",
//   fontSize: "12px",
//   fontWeight: "700",
// };

// const grid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//   gap: "18px",
// };

// const card = {
//   background: theme.card,
//   borderRadius: "20px",
//   overflow: "hidden",
//   boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
// };

// const cardHeader = {
//   padding: "18px 20px",
//   borderBottom: "1px solid rgba(0,0,0,0.06)",
//   fontWeight: "700",
// };

// const cardBody = {
//   padding: "20px",
// };

// const infoRow = {
//   marginBottom: "18px",
// };

// const infoLabel = {
//   fontSize: "12px",
//   color: "#6b7280",
// };

// const infoValue = {
//   fontSize: "14px",
//   fontWeight: "600",
//   color: theme.dark,
// };

// export default BankProfilePage;


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
          <button style={backBtn} onClick={() => navigate("/bank/dashboard")}>← Back</button>
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
          <button style={backBtn} onClick={() => navigate("/bank/dashboard")}>← Back</button>
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
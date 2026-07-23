import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/PageLayout";
import PortalLayout from "../../components/PortalLayout";
import BASE_URL from "../../api";

// Nav groups 
const NAV_GROUPS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard",       emoji: "⊞", route: "/nira",          badge: null },
      { label: "Add ID",          emoji: "🔎", route: "/nira/add-id",    badge: null },
      { label: "Search Database", emoji: "⌕", route: "/nira/search",   badge: null },
      { label: "View Reports",    emoji: "☰",  route: "/nira/records",  badge: null },
    ],
  },
  {
    section: "Records",
    items: [
      { label: "Manage Records",  emoji: "🚨",  route: "/nira/manage",   badge: null },
      { label: "Flagged IDs",     emoji: "⚑",  route: "/nira/flagged",  badge: 0    },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Audit Log",       emoji: "◷",  route: "/nira/audit",    badge: null },
      { label: "Settings",        emoji: "⚙",  route: "/nira/settings", badge: null },
      { label: "Profile",         emoji: "👤",  route: "/nira/profile",  badge: null },
    ],
  },
];

const STATUS_STYLE = {
  "under review":        { label: "Under Review",       bg: "bg-[#faeeda]", text: "text-[#854f0b]" },
  "cleared":             { label: "Cleared",            bg: "bg-[#eaf3de]", text: "text-[#3b6d11]" },
  "confirmed fraud":     { label: "Confirmed Fraud",    bg: "bg-[#fcebeb]", text: "text-[#a32d2d]" },
  "under investigation": { label: "Under Investigation", bg: "bg-[#e8eaf6]", text: "text-[#3949ab]" },
};

const QUICK_ACTIONS = [
  { label: "Add a Found ID", desc: "Look up a NIN in the ID records database", emoji: "🔎", route: "/nira/add-id" },
  { label: "Fraud Reports",  desc: "View IDs confirmed as fraudulent",        emoji: "🚨", route: "/nira/flagged" },
];

// NavItem 
function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 w-full p-2.5 rounded-lg border-0 text-left cursor-pointer text-xs transition-colors duration-150 ${
        active
          ? "bg-primary text-white font-semibold"
          : "bg-transparent text-gray-500 hover:bg-black/5 hover:text-gray-900 font-normal"
      }`}
    >
      <span className="text-sm w-4.5 text-center shrink-0">
        {item.emoji}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">
          {item.badge}
        </span>
      ) : null}
    </button>
  );
}

// StatCard 
function StatCard({ stat }) {
  return (
    <div className="bg-white/55 border border-white/20 rounded-2xl p-4">
      <div className="text-[11px] text-gray-500 mb-1.5">{stat.label}</div>
      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
      <div className={`text-[11px] mt-1 ${stat.positive ? "text-[#3b6d11]" : "text-[#a32d2d]"}`}>
        {stat.delta}
      </div>
    </div>
  );
}

// QuickActionBtn 
function QuickActionBtn({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl border border-black/10 bg-transparent hover:bg-black/5 cursor-pointer text-left transition-colors duration-150 w-full"
    >
      <span className="text-xl shrink-0">{item.emoji}</span>
      <div>
        <div className="text-xs font-semibold text-gray-900">{item.label}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
      </div>
    </button>
  );
}

// Access Denied 
function AccessDenied({ navigate }) {
  return (
    <div className="w-full max-w-[520px] mx-auto p-6 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
        <h2 className="m-0 text-3xl font-bold text-gray-900">🔐 Access Denied</h2>
        <p className="text-gray-500 my-3 mb-6">You are not authorized to access the NIRA portal.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button 
            className="min-w-[160px] px-4 py-3 rounded-2xl border-0 bg-primary text-white cursor-pointer font-bold transition-opacity hover:opacity-90"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
          <button 
            className="min-w-[160px] px-4 py-3 rounded-2xl border-0 bg-secondary text-white cursor-pointer font-bold transition-opacity hover:opacity-90"
            onClick={() => navigate("/nira/login")}
          >
            NIRA Staff Login
          </button>
        </div>
      </div>
    </div>
  );
}

// Main NiraDashboard 
export default function NiraDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_ids: 0,
    flagged_count: 0,
    pending_review: 0,
    resolved_ids: 0,
  });
  const [recentFlagged, setRecentFlagged] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user) { if (isMounted) setLoading(false); return; }
      await fetchDashboard();
      if (isMounted) setLoading(false);
    };
    load();
    const interval = setInterval(fetchDashboard, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/nira/dashboard/`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || {
          total_ids: 0, flagged_count: 0, pending_review: 0, resolved_ids: 0,
        });
        setRecentFlagged(Array.isArray(data.recent_flagged) ? data.recent_flagged : []);
      }
    } catch (err) {
      console.error("NIRA dashboard fetch error:", err);
    }
  };

  if (!user) return <PortalLayout><AccessDenied navigate={navigate} /></PortalLayout>;

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) => location.pathname === item.route ||
      (item.route !== "/nira" && location.pathname.startsWith(item.route))
  );
  const pageTitleText = activeItem?.label || "Dashboard";
  const isNiraRoot = location.pathname === "/nira";

  const handleNav = (route) => navigate(route);
  const handleLogout = () => {
    logout();
    navigate("/nira/login");
  };

  // inject live badge count into Flagged IDs nav item
  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.route === "/nira/flagged"
        ? { ...item, badge: stats.pending_review || 0 }
        : item
    ),
  }));

  if (loading) return <PageLayout><div className="p-5">Loading NIRA dashboard...</div></PageLayout>;

  return (
    <PortalLayout 
      navGroups={navGroups} 
      orgName="NIRA Portal" 
      orgIcon="🪪" 
      pageTitle={pageTitleText} 
      user={user} 
      onLogout={handleLogout}
    >
      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        {isNiraRoot ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4.5">
              <StatCard stat={{ label: "Total ID Records", value: stats.total_ids, delta: "In system", positive: true }} />
              <StatCard stat={{ label: "Flagged IDs", value: stats.flagged_count, delta: "Need attention", positive: false }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-3 px-4 border-b border-black/5">
                  <span className="text-xs font-bold text-gray-900">Recently Flagged IDs</span>
                  <button className="text-[11px] text-primary border-0 bg-transparent cursor-pointer hover:underline" onClick={() => handleNav("/nira/flagged")}>
                    View all →
                  </button>
                </div>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      {["Name", "NIN", "Status"].map((h) => (
                        <th key={h} className="text-left py-2 px-4 text-gray-500 font-semibold border-b border-black/5 text-[11px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentFlagged.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500 text-xs">
                          No flagged IDs yet
                        </td>
                      </tr>
                    ) : (
                      recentFlagged.map((row, i) => {
                        const isLast = i === recentFlagged.length - 1;
                        const rawStatus = (row.status || "").toLowerCase();
                        const s = STATUS_STYLE[rawStatus] ?? { label: row.status, bg: "bg-gray-200", text: "text-gray-700" };
                        
                        return (
                          <tr key={i}>
                            <td className={`p-2.5 px-4 text-gray-900 ${!isLast ? "border-b border-black/5" : ""}`}>
                              {row.name}
                            </td>
                            <td className={`p-2.5 px-4 text-gray-500 font-mono ${!isLast ? "border-b border-black/5" : ""}`}>
                              {row.nin}
                            </td>
                            <td className={`p-2.5 px-4 ${!isLast ? "border-b border-black/5" : ""}`}>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.bg} ${s.text}`}>
                                {s.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-3 px-4 border-b border-black/5">
                  <span className="text-xs font-bold text-gray-900">Quick Actions</span>
                </div>
                <div className="p-3 px-4 flex flex-col gap-2">
                  {QUICK_ACTIONS.map((q) => (
                    <QuickActionBtn key={q.route} item={q} onClick={() => handleNav(q.route)} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </PortalLayout>
  );
}
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/PageLayout";
import PortalLayout from "../../components/PortalLayout";
import BASE_URL from "../../api";

// Sub-components
import { StatCard } from "../../components/udls/StatCard";
import { QuickActionBtn } from "../../components/udls/QuickActionBtn";
import { RecentReportsTable } from "../../components/udls/RecentReportsTable";
import { AccessDenied } from "../../components/udls/AccessDenied";

// ── NAV GROUPS & QUICK ACTIONS DATA ─────────────────────────────────────────
const NAV_GROUPS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", emoji: "⊞", route: "/udls/dashboard", badge: null },
      { label: "Add Permit", emoji: "➕", route: "/udls/add", badge: null },
      { label: "Search Database", emoji: "⌕", route: "/udls/search", badge: null },
      { label: "View Reports", emoji: "☰", route: "/udls/records", badge: null },
    ],
  },
  {
    section: "Records",
    items: [
      { label: "Manage Permits", emoji: "✎", route: "/udls/manage", badge: null },
      { label: "Flagged Permits", emoji: "⚑", route: "/udls/flagged", badge: 0 },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Audit Log", emoji: "◷", route: "/udls/audit", badge: null },
      { label: "Settings", emoji: "⚙", route: "/udls/settings", badge: null },
      { label: "Profile", emoji: "👤", route: "/udls/profile", badge: null },
    ],
  },
];

const QUICK_ACTIONS = [
  {
    label: "Add Permit",
    desc: "Register a new driver permit into the system",
    emoji: "➕",
    route: "/udls/add",
  },
  {
    label: "Fraud Permits",
    desc: "View permits flagged for fraud review",
    emoji: "🚨",
    route: "/udls/flagged",
  },
];

function UdlsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState({
    total_permits: 0,
    flagged_count: 0,
    pending_review: 0,
  });

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/udls/dashboard/`);
      if (res.ok) {
        const data = await res.json();
        setStats({
          total_permits: data.stats?.total_permits ?? 0,
          flagged_count: data.stats?.flagged_count ?? 0,
          pending_review: data.stats?.pending_review ?? 0,
        });
        setRecentReports(data.recent_reports || []);
      }
    } catch (err) {
      console.error("UDLS dashboard error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }
      await fetchDashboard();
      if (isMounted) setLoading(false);
    };

    load();
    const interval = setInterval(fetchDashboard, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  // Auth Protection Guard
  if (!user) {
    return (
      <PageLayout>
        <AccessDenied onNavigateHome={() => navigate("/")} />
      </PageLayout>
    );
  }

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) =>
      location.pathname === item.route ||
      (item.route !== "/udls" && location.pathname.startsWith(item.route))
  );

  const pageTitleText = activeItem?.label || "Dashboard";
  const isRoot = location.pathname === "/udls/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/udls/login");
  };

  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.route === "/udls/flagged"
        ? { ...item, badge: stats.flagged_count || 0 }
        : item
    ),
  }));

  if (loading) {
    return (
      <PortalLayout pageTitle={pageTitleText} orgName="UDLS Portal" orgIcon="🪪" user={user}>
        <div className="p-6 text-sm text-gray-500 animate-pulse">
          Loading UDLS dashboard...
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      navGroups={navGroups}
      pageTitle={pageTitleText}
      orgName="UDLS Portal"
      orgIcon="🪪"
      user={user}
      onLogout={handleLogout}
    >
      <div className="p-6 overflow-y-auto flex-1">
        {isRoot ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <StatCard
                stat={{
                  label: "Total Permits",
                  value: stats.total_permits,
                  delta: "Driver permits registered",
                  positive: true,
                }}
              />
              <StatCard
                stat={{
                  label: "Flagged Permits",
                  value: stats.flagged_count,
                  delta: "Under review",
                  positive: false,
                }}
              />
              <StatCard
                stat={{
                  label: "Resolved Cases",
                  value: stats.pending_review,
                  delta: "Completed reviews",
                  positive: true,
                }}
              />
            </div>

            {/* Content Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Reports Panel */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    Recent Reports
                  </span>
                  <button
                    onClick={() => navigate("/udls/flagged")}
                    className="text-xs text-slate-700 hover:text-black font-semibold cursor-pointer"
                  >
                    View all →
                  </button>
                </div>
                <RecentReportsTable reports={recentReports} />
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900">
                    Quick Actions
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {QUICK_ACTIONS.map((q) => (
                    <QuickActionBtn
                      key={q.route}
                      item={q}
                      onClick={() => navigate(q.route)}
                    />
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

export default UdlsDashboard;
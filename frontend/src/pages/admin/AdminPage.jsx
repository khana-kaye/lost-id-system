import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PortalLayout from "../../components/PortalLayout";
import PageLayout from "../../components/PageLayout";
import BASE_URL from "../../api";

// ── NAV GROUPS ──────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", emoji: "⊞", route: "/admin", badge: null },
      { label: "Add Found Document", emoji: "+", route: "/admin/add", badge: null },
      { label: "Search Database", emoji: "⌕", route: "/admin/search", badge: null },
      { label: "View Reports", emoji: "☰", route: "/admin/reports", badge: 0 },
    ],
  },
  {
    section: "Records",
    items: [
      { label: "Manage Records", emoji: "✎", route: "/admin/manage", badge: null },
      { label: "Flagged Documents", emoji: "⚑", route: "/admin/flagged", badge: 2 },
      { label: "Criminal Records", emoji: "➤", route: "/admin/criminal-records", badge: null },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Audit Log", emoji: "◷", route: "/admin/audit", badge: null },
      { label: "Settings", emoji: "⚙", route: "/admin/settings", badge: null },
      { label: "Officer Profile", emoji: "👤", route: "/admin/profile", badge: null },
    ],
  },
];

// ── STATUS STYLES ───────────────────────────────────────────────────────────
const STATUS_STYLE = {
  open: { label: "Open", className: "bg-amber-100 text-amber-800" },
  found: { label: "Found", className: "bg-lime-100 text-lime-800" },
  closed: { label: "Closed", className: "bg-stone-100 text-stone-600" },
};

// ── QUICK ACTIONS ───────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Add Found ID", desc: "Register a newly found National ID or permit", emoji: "➕", route: "/admin/add" },
  { label: "Search Database", desc: "Look up records by name or ID number", emoji: "🔍", route: "/admin/search" },
];

// ── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, positive }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className={`text-xs mt-1 ${positive ? "text-lime-700" : "text-red-700"}`}>
        {delta}
      </div>
    </div>
  );
}

// ── QUICK ACTION BUTTON ─────────────────────────────────────────────────────
function QuickActionBtn({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/40 p-3 text-left transition-colors hover:bg-white/70"
    >
      <span className="text-xl flex-shrink-0">{item.emoji}</span>
      <div>
        <div className="text-xs font-semibold text-gray-900">{item.label}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
      </div>
    </button>
  );
}

// ── ACCESS DENIED ───────────────────────────────────────────────────────────
function AccessDenied({ navigate }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-lg items-center justify-center p-6">
      <div className="w-full rounded-3xl border border-white/20 bg-white p-8 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900">🔐 Access Denied</h2>
        <p className="my-3 text-sm text-gray-500">
          You are not authorized to access the police portal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="min-w-[140px] rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
          <button
            className="min-w-[140px] rounded-2xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            onClick={() => navigate("/admin/login")}
          >
            Officer Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ADMIN PAGE ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_reports: 0,
    total_ids: 0,
    total_atms: 0,
    total_driver_permits: 0,
  });
  const [recentReports, setRecentReports] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/dashboard/`);

      if (res.ok) {
        const data = await res.json();
        setStats({
          total_reports: data.stats?.total_reports ?? 0,
          total_ids: data.stats?.total_ids ?? 0,
          total_atms: data.stats?.total_atms ?? 0,
          total_driver_permits: data.stats?.total_driver_permits ?? 0,
        });
        setRecentReports(data.recent_reports || []);
        return;
      }

      if (user?.role === "officer" && user.username) {
        const r = await fetch(`${BASE_URL}/officer/${encodeURIComponent(user.username)}/`);
        if (r.ok) {
          const d = await r.json();
          setStats({
            total_reports: d.stats?.reportsHandled ?? 0,
            total_ids: d.stats?.idsRecovered ?? 0,
            total_atms: 0,
            total_driver_permits: 0,
          });
          setRecentReports(Array.isArray(d.recent_reports) ? d.recent_reports : []);
        }
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, [user]);

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

    const interval = setInterval(() => {
      fetchDashboard();
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, fetchDashboard]);

  if (!user || user.role !== "officer") {
    return (
      <PageLayout>
        <AccessDenied navigate={navigate} />
      </PageLayout>
    );
  }

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) => location.pathname === item.route || location.pathname.startsWith(item.route)
  );

  const pageTitleText = activeItem?.label || "Dashboard";
  const isAdminRoot = location.pathname === "/admin";

  if (loading) {
    return (
      <PageLayout>
        <div className="p-5 text-gray-600">Loading dashboard...</div>
      </PageLayout>
    );
  }

  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.route === "/admin/reports"
        ? { ...item, badge: stats.total_reports || 0 }
        : item
    ),
  }));

  return (
    <PortalLayout
      navGroups={navGroups}
      orgName="Uganda Police"
      orgIcon="🛡"
      pageTitle={pageTitleText}
      user={user}
      onLogout={() => navigate("/logout")}
    >
      <div className="min-h-full p-5 lg:p-6">
        {isAdminRoot ? (
          <>
            {/* Stats Overview */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Reports" value={stats.total_reports} delta="Lost item reports" positive />
              <StatCard label="Total IDs" value={stats.total_ids} delta="National IDs" positive />
              <StatCard label="Total ATMs" value={stats.total_atms} delta="ATM cards" positive />
              <StatCard label="Driver Permits" value={stats.total_driver_permits} delta="Driver licenses" positive />
            </div>

            {/* Panels Section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Recent Reports Panel */}
              <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
                  <span className="text-xs font-bold text-gray-900">Recent Reports</span>
                  <button
                    className="text-xs text-indigo-600 hover:underline"
                    onClick={() => navigate("/admin/reports")}
                  >
                    View all →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-black/5 text-gray-500">
                        {["Name", "Type", "Status"].map((h) => (
                          <th key={h} className="px-4 py-2 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {Array.isArray(recentReports) &&
                        recentReports.map((row, i) => {
                          const rawStatus = (row.status || "").toString().trim().toLowerCase();
                          const s = STATUS_STYLE[rawStatus] ?? {
                            label: "Unknown",
                            className: "bg-gray-200 text-gray-700",
                          };
                          return (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                              <td className="px-4 py-2.5 text-gray-500">{row.type}</td>
                              <td className="px-4 py-2.5">
                                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.className}`}>
                                  {s.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="border-b border-black/5 px-4 py-3">
                  <span className="text-xs font-bold text-gray-900">Quick Actions</span>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  {QUICK_ACTIONS.map((q) => (
                    <QuickActionBtn key={q.route} item={q} onClick={() => navigate(q.route)} />
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
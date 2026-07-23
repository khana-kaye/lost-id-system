import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import PortalLayout from "../../components/PortalLayout";
import { useAuth } from "../../context/AuthContext";
import BASE_URL from "../../api";
import BankSettings from "./BankSettings";
import BankProfilePage from "./BankProfilePage";

// Modular Sub-components
import RecentReportsPanel from "../../components/bank/RecentReportsPanel";
import ReportForm from "../../components/bank/ReportForm";
import ReportsTable from "../../components/bank/ReportsTable";
import FreezeManagementTable from "../../components/bank/FreezeManagementTable";
import AuditLogsTable from "../../components/bank/AuditLogsTable";
import ReportDetailsView from "../../components/bank/ReportDetailsView";
import QuickActionsPanel from "../../components/bank/QuickActionsPanel";

const STATUS_STYLE = {
  Pending: { label: "Pending", bg: "bg-amber-100", color: "text-amber-800" },
  Resolved: { label: "Resolved", bg: "bg-emerald-100", color: "text-emerald-800" },
};

const navGroups = [
  {
    section: "Management",
    items: [
      { label: "Dashboard", route: "/bank/dashboard?view=recent", emoji: "📊" },
      { label: "Report Lost ATM", route: "/bank/dashboard?view=report", emoji: "💳" },
      { label: "Freeze Card", route: "/bank/dashboard?view=freeze", emoji: "❄️" },
      { label: "Reports", route: "/bank/dashboard?view=reports", emoji: "📄" },
      { label: "Audit Logs", route: "/bank/dashboard?view=audit", emoji: "📋" },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Settings", route: "/bank/dashboard?view=settings", emoji: "⚙️" },
      { label: "Profile", route: "/bank/dashboard?view=profile", emoji: "👤" },
    ],
  },
];

const HEADER_COPY = {
  recent: { title: "ATM Management Dashboard", subtitle: "Monitor lost ATM reports and customer card security." },
  report: { title: "Report Lost ATM", subtitle: "Create a new lost ATM report without leaving the dashboard." },
  reports: { title: "ATM Reports", subtitle: "See all lost ATM cases in one place." },
  freeze: { title: "Freeze Card Management", subtitle: "Freeze or unfreeze cards directly from the dashboard." },
  audit: { title: "Bank Audit Logs", subtitle: "Review recent bank audit activity." },
  settings: { title: "Bank Settings", subtitle: "Manage your bank account settings." },
  profile: { title: "Bank Profile", subtitle: "View your bank profile information." },
  details: { title: "Report Details", subtitle: "Review the selected ATM report." },
};

function BankDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeView = searchParams.get("view") || "recent";

  const setActiveView = (view) => {
    setSearchParams({ view });
  };

  const childRouteActive = ![
    "/bank",
    "/bank/",
    "/bank/dashboard",
    "/bank/dashboard/",
  ].includes(location.pathname);

  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    card_holder: "",
    account_number: "",
    bank_name: "",
    card_type: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/bank/login");
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BASE_URL}/atm/reports/`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/bank/audit-logs/`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Audit fetch error:", err);
      setLogs([]);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "audit") {
      fetchAuditLogs();
    }
  }, [activeView]);

  const QUICK_ACTIONS = [
    {
      label: "Report Lost ATM",
      desc: "Create ATM loss report",
      emoji: "💳",
      action: () => {
        setSelectedReport(null);
        setActiveView("report");
      },
    },
    {
      label: "View Reports",
      desc: "See all ATM reports",
      emoji: "📄",
      action: () => {
        setSelectedReport(null);
        setActiveView("reports");
      },
    },
  ];

  const handleReportChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/atm/reports/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      alert("ATM report submitted");
      setFormData({
        card_holder: "",
        account_number: "",
        bank_name: "",
        card_type: "",
        reason: "",
      });
      fetchReports();
      setActiveView("recent");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleCardStatus = async (report) => {
    try {
      const action = report.card_status === "Frozen" ? "resolve" : "freeze";
      const res = await fetch(`${BASE_URL}/atm/reports/${report.id}/toggle/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Failed to update card");
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Failed to update card");
    }
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setActiveView("details");
  };

  const renderPanelContent = () => {
    switch (activeView) {
      case "report":
        return (
          <ReportForm
            formData={formData}
            onChange={handleReportChange}
            onSubmit={handleReportSubmit}
            loading={loading}
          />
        );
      case "reports":
        return (
          <ReportsTable
            reports={reports}
            statusStyles={STATUS_STYLE}
            onSelectReport={handleReportSelect}
            onBack={() => setActiveView("recent")}
          />
        );
      case "freeze":
        return (
          <FreezeManagementTable
            reports={reports}
            onToggleStatus={toggleCardStatus}
            onBack={() => setActiveView("recent")}
          />
        );
      case "audit":
        return (
          <AuditLogsTable
            logs={logs}
            loading={auditLoading}
            onBack={() => setActiveView("recent")}
          />
        );
      case "details":
        return selectedReport ? (
          <ReportDetailsView
            report={selectedReport}
            statusStyles={STATUS_STYLE}
            onBack={() => setActiveView("reports")}
          />
        ) : null;
      case "settings":
        return <BankSettings embedded />;
      case "profile":
        return <BankProfilePage embedded />;
      default:
        return <QuickActionsPanel actions={QUICK_ACTIONS} />;
    }
  };

  const pageHeader = HEADER_COPY[activeView] || HEADER_COPY.recent;

  return (
    <PortalLayout
      pageTitle={pageHeader.title}
      navGroups={navGroups}
      orgName="Bank ATM Portal"
      orgIcon="🏦"
      user={user}
      onLogout={handleLogout}
    >
      {childRouteActive ? (
        <div className="p-3">
          <Outlet />
        </div>
      ) : (
        <div className={`grid gap-4 ${activeView === "recent" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {activeView === "recent" && (
            <RecentReportsPanel
              reports={reports}
              statusStyles={STATUS_STYLE}
              onSelectReport={handleReportSelect}
            />
          )}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {renderPanelContent()}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

export default BankDashboard;
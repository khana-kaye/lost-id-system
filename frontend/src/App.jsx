


import Navbar from "./components/navbar";
import { useAuth } from "./context/AuthContext";
import Landingpage from "./pages/Landingpage";

import { Routes, Route, Navigate } from "react-router-dom";

import SearchPage from "./pages/admin/SearchPage";
import ReportPage from "./pages/admin/ReportPage";
import AdminPage from "./pages/admin/AdminPage";
import LoginPage from "./pages/admin/adminlogin";
import SignupPage from "./pages/admin/adminsignup";
import ProtectedRoute from "./components/ProtectedRoute";

import AddFoundIDPage from "./pages/admin/add";
import ViewReportsPage from "./pages/admin/ViewReportsPage";
import ManageRecordsPage from "./pages/admin/ManageRecordsPage";
import RecordDetailsPage from "./pages/admin/RecordDetailsPage";


import NiraSignup from "./pages/nira/NiraSignup";
import NiraLogin from "./pages/nira/NiraLogin";
import NiraDashboard from "./pages/nira/NiraDashboard";
// import NiraVerifyPage from "./pages/nira/NiraVerifyPage";
import NiraAuditPage from "./pages/nira/NiraAuditPage";
import NiraSettingsPage from "./pages/nira/NiraSettingsPage";
import NiraProfilePage from "./pages/nira/NiraProfilePage";
import NiraSearchPage from "./pages/nira/NiraSearchPage";
import NiraViewReportsPage from "./pages/nira/NiraViewReportsPage";
import NiraManageRecords from "./pages/nira/NiraManageRecords"; 


import BankLogin from "./pages/bank/BankLogin";
import BankSignup from "./pages/bank/BankSignup";

import UdlsLogin from "./pages/udls/UdlsLogin";
import UdlsSignup from "./pages/udls/UdlsSignup";
import UdlsAddPermit from "./pages/udls/UdlsAddPermit";
import UdlsAuditPage from "./pages/udls/UdlsAuditPage";
import UdlsSettingsPage from "./pages/udls/UdlsSettingsPage";
import UdlsDashboard from "./pages/udls/UdlsDashboard";
import UdlsFlaggedPermitsPage from "./pages/udls/UdlsFlaggedPermitsPage";
import UdlsManageRecords from "./pages/udls/UdlsManageRecords";
import UdlsProfilePage from "./pages/udls/UdlsProfilePage";
import UdlsSearchPage from "./pages/udls/UdlsSearchPage";
import UdlsViewReports from "./pages/udls/UdlsViewReports";

import FlaggedIDsPage from "./pages/admin/FlaggedIDsPage";
import AuditLogPage from "./pages/admin/AuditLogPage";
import SettingsPage from "./pages/admin/SettingsPage";
import OfficerProfilePage from "./pages/admin/OfficerProfilePage";
// import LogoutPage from "./pages/LogoutPage";
import BankDashboard from "./pages/bank/BankDashboard";
import ReportLostATMPage from "./pages/bank/ReportLostATMPage";
import BankReportsPage from "./pages/bank/BankReportsPage";
import FreezeCardPage from "./pages/bank/FreezeCardPage";
import UdlsVerifyPage from "./pages/udls/UdlsVerifyPage";


import BankAuditLogsPage from "./pages/bank/BankAuditLogsPage";
import BankSettings from "./pages/bank/BankSettings";
import BankProfilePage from "./pages/bank/BankProfilePage";


import NiraAddIDPage from "./pages/nira/NiraAddIDPage";
import NiraFlaggedIDsPage from "./pages/nira/NiraFlaggedIDsPage";

import CriminalRecordsPage from "./pages/admin/CriminalRecrdsPage";

import BankSearchPage from "./pages/bank/BankSearchPage";


function App() {
  const { user } = useAuth();

  return (
    <>
      {!user && <Navbar />}

      <Routes>
        <Route path="/" element={<Landingpage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="officer">
              <AdminPage />
            </ProtectedRoute>
          }
        >
            <Route path="add" element={<AddFoundIDPage embedded />} />
            <Route path="search" element={<SearchPage mode="admin" embedded />} />
            <Route path="reports" element={<ViewReportsPage embedded />} />
            <Route path="manage" element={<ManageRecordsPage embedded />} />
            <Route path="records/:id" element={<RecordDetailsPage />} />
            <Route path="flagged" element={<FlaggedIDsPage embedded />} />
            <Route path="audit" element={<AuditLogPage embedded />} />
            <Route path="settings" element={<SettingsPage embedded />} />
            <Route path="profile" element={<OfficerProfilePage embedded />} />
            <Route path="criminal-records" element={<CriminalRecordsPage />} />
        </Route>

        <Route path="/search" element={<SearchPage mode ="public" />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />


        {/* ── NIRA Dashboard & Nested Outlets ── */}
        <Route path="/nira" element={
          <ProtectedRoute>
            <NiraDashboard />
          </ProtectedRoute>
          }>
          <Route path="flagged" element={<NiraFlaggedIDsPage embedded />} />
          <Route path="add-id" element={<NiraAddIDPage embedded />} />
          <Route path="search" element={<NiraSearchPage embedded />} />
          <Route path="records" element={<NiraViewReportsPage embedded />} />
          <Route path="/nira/settings" element={<NiraSettingsPage embedded />} />
          <Route path="profile" element={<NiraProfilePage embedded />} />
          <Route path="manage" element={<NiraManageRecords embedded/>} />
          <Route path="audit" element={<NiraAuditPage embedded />} />
        </Route>

        {/* Standalone NIRA Auth Views (No Sidebar) */}
        <Route path="/nira/signup" element={<NiraSignup />} />
        <Route path="/nira/login" element={<NiraLogin />} />
        
        {/* ── Bank Subsystem (shared layout) ── */}
        <Route path="/bank/login" element={<BankLogin />} />
        <Route path="/bank/signup" element={<BankSignup />} />
        
        <Route
          path="/bank/*"
          element={
            <ProtectedRoute>
              <BankDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<div />} />
          <Route path="report" element={<ReportLostATMPage embedded />} />
          <Route path="reports" element={<BankReportsPage embedded />} />
          <Route path="freeze" element={<FreezeCardPage embedded />} />
          <Route path="audit-logs" element={<BankAuditLogsPage embedded />} />
          <Route path="settings" element={<BankSettings embedded />} />
          <Route path="profile" element={<BankProfilePage embedded />} />
          <Route path="search" element={<BankSearchPage embedded />} />
        </Route>

        {/* ── UDLS Subsystem (shared layout) ── */}
        <Route path="/udls/login" element={<UdlsLogin />} />
        <Route path="/udls/signup" element={<UdlsSignup />} />

        <Route
          path="/udls/*"
          element={
            <ProtectedRoute>
              <UdlsDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<div />} />
          <Route path="verify" element={<UdlsVerifyPage embedded />} />
          <Route path="audit" element={<UdlsAuditPage embedded />} />
          <Route path="settings" element={<UdlsSettingsPage embedded />} />
          <Route path="add" element={<UdlsAddPermit embedded />} />
          <Route path="flagged" element={<UdlsFlaggedPermitsPage embedded />} />
          <Route path="manage" element={<UdlsManageRecords embedded />} />
          <Route path="profile" element={<UdlsProfilePage embedded />} />
          <Route path="search" element={<UdlsSearchPage embedded />} />
          <Route path="records" element={<UdlsViewReports embedded />} />
        </Route>
        
        
        <Route/>

        
      </Routes>
    </>
  );
}

export default App;
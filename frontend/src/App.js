


import Navbar from "./components/navbar";
import Landingpage from "./pages/Landingpage";

import { Routes, Route, Navigate } from "react-router-dom";

import SearchPage from "./pages/SearchPage";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/adminlogin";
import SignupPage from "./pages/adminsignup";
import ProtectedRoute from "./components/ProtectedRoute";

import AddFoundIDPage from "./pages/admin/add";
import ViewReportsPage from "./pages/ViewReportsPage";
import ManageRecordsPage from "./pages/ManageRecordsPage";
import RecordDetailsPage from "./pages/RecordDetailsPage";


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

import FlaggedIDsPage from "./pages/FlaggedIDsPage";
import AuditLogPage from "./pages/AuditLogPage";
import SettingsPage from "./pages/SettingsPage";
import OfficerProfilePage from "./pages/OfficerProfilePage";
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

import CriminalRecordsPage from "./pages/CriminalRecrdsPage";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landingpage />} />
        
        {/* ── Admin Subsystem ── */}
        {/* <Route
           path="/admin/*" 
           element={
            <ProtectedRoute requiredRole="officer" >
              <AdminPage />
            </ProtectedRoute>
            }>
              <Route path="add" element={<AddFoundIDPage embedded />} />
              <Route path="search" element={<SearchPage mode="admin" embedded />} />
              <Route path="reports" element={<ViewReportsPage embedded />} />
              <Route path="manage" element={<ManageRecordsPage embedded />} />
              <Route path="records/:id" element={<RecordDetailsPage />} />
              <Route path="flagged" element={<FlaggedIDsPage embedded />} />
              <Route path="audit" element={<AuditLogPage embedded />} />
              <Route path="settings" element={<SettingsPage embedded />} />
              <Route path="profile" element={<OfficerProfilePage embedded />} />
        </Route> */}


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
        <Route path="/nira" element={<NiraDashboard />}>
          <Route path="flagged" element={<NiraFlaggedIDsPage />} />
          <Route path="add-id" element={<NiraAddIDPage />} />
          <Route path="search" element={<NiraSearchPage />} />
          <Route path="records" element={<NiraViewReportsPage />} />
          <Route path="/nira/settings" element={<NiraSettingsPage />} />
          <Route path="profile" element={<NiraProfilePage />} />
          <Route path="manage" element={<NiraManageRecords/>} />
          <Route path="audit" element={<NiraAuditPage />} />
        </Route>

        {/* Standalone NIRA Auth Views (No Sidebar) */}
        <Route path="/nira/signup" element={<NiraSignup />} />
        <Route path="/nira/login" element={<NiraLogin />} />
        
        {/* ── Bank Subsystem ── */}
        <Route path="/bank/login" element={<BankLogin />} />
        <Route path="/bank/signup" element={<BankSignup />} />
        <Route path="/bank/dashboard" element={<BankDashboard />}/>
        <Route path="/bank/report" element={<ReportLostATMPage />} />
        <Route path="/bank/reports" element={<BankReportsPage />} />
        <Route path="/bank/freeze" element={<FreezeCardPage />} />
        <Route path="/bank/audit-logs" element={<BankAuditLogsPage />} />
        <Route path="/bank/settings" element={<BankSettings />} />
        <Route path="/bank/profile" element={<BankProfilePage />} />

        {/* ── UDLS Subsystem ── */}
        <Route path="/udls" element={<Navigate to="/udls/dashboard" />} />
        <Route path="/udls/login" element={<UdlsLogin />} />
        <Route path="/udls/signup" element={<UdlsSignup />} />
        
        <Route
          path="/udls/dashboard"
          element={
            <ProtectedRoute>
              <UdlsDashboard />
            </ProtectedRoute>
          }
        />

            <Route path="/udls/verify" element={<UdlsVerifyPage />} />
            <Route path="/udls/audit" element={<UdlsAuditPage />} />
            <Route path="/udls/settings" element={<UdlsSettingsPage />} />
            <Route path="/udls/add" element={<UdlsAddPermit />} />
            <Route path="/udls/flagged" element={<UdlsFlaggedPermitsPage />} />
            <Route path="/udls/manage" element={<UdlsManageRecords />} />
            <Route path="/udls/profile" element={<UdlsProfilePage />} />
            <Route path="/udls/search" element={<UdlsSearchPage />} />
            <Route path="/udls/records" element={<UdlsViewReports />} />
        
        
        <Route/>

        
      </Routes>
    </>
  );
}

export default App;
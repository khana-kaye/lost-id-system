

import Navbar from "./components/navbar";
import Landingpage from "./pages/Landingpage";

import { Routes, Route } from "react-router-dom";

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

import NiraAuth from "./pages/NiraAuth";
import NiraSignup from "./pages/nira/NiraSignup";
import NiraLogin from "./pages/nira/NiraLogin";

import BankLogin from "./pages/bank/BankLogin";
import BankSignup from "./pages/bank/BankSignup";

import UnebLogin from "./pages/uneb/UnebLogin";
import UnebSignup from "./pages/uneb/UnebSignup";

import FlaggedIDsPage from "./pages/FlaggedIDsPage";
import AuditLogPage from "./pages/AuditLogPage";
import SettingsPage from "./pages/SettingsPage";
import OfficerProfilePage from "./pages/OfficerProfilePage";
import LogoutPage from "./pages/LogoutPage";
import NiraPortalPage from "./pages/nira/NiraPortalPage";
import BankDashboard from "./pages/bank/BankDashboard";
import UnebDashboard from "./pages/uneb/UnebDashboard";
import ReportLostATMPage from "./pages/bank/ReportLostATMPage";
import BankReportsPage from "./pages/bank/BankReportsPage";
import FreezeCardPage from "./pages/bank/FreezeCardPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/admin" element={
          <ProtectedRoute >
            <AdminPage />
          </ProtectedRoute> 
          } />


          <Route path="/admin/add" element={
            <ProtectedRoute>
              <AddFoundIDPage />
            </ProtectedRoute>
          } />



        <Route path="/search" element={<SearchPage mode ="public" />} />
        <Route
          path="/admin/search"
          element={
            <ProtectedRoute>
              <SearchPage mode="admin" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <ViewReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage"
          element={
            <ProtectedRoute>
              <ManageRecordsPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/records/:id"
  element={
    <ProtectedRoute>
      <RecordDetailsPage />
    </ProtectedRoute>
  }
/>





        <Route
         path="/report" element={<ReportPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/signup" element={<SignupPage />} />
        <Route path="/nira" element={<NiraAuth />} />
        <Route path="/nira/signup" element={<NiraSignup />} />
        <Route path="/nira/login" element={<NiraLogin />} />
        <Route path="/bank/login" element={<BankLogin />} />
        <Route path="/bank/signup" element={<BankSignup />} />
        <Route path="/uneb/login" element={<UnebLogin />} />
        <Route path="/uneb/signup" element={<UnebSignup />} />
        <Route path="/admin/flagged" element={<FlaggedIDsPage />} />
        <Route path="/admin/audit" element={<AuditLogPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/profile" element={<OfficerProfilePage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/admin/forward" element={<NiraPortalPage />} />
        <Route path="/bank/dashboard" element={<BankDashboard />}/>
        <Route path="/uneb/dashboard" element={<UnebDashboard />}/>
        <Route path="/bank/report" element={<ReportLostATMPage />} />
        <Route path="/bank/reports" element={<BankReportsPage />} />
        <Route path="/bank/freeze" element={<FreezeCardPage />} />



      </Routes>
    </>
  );
}

export default App;
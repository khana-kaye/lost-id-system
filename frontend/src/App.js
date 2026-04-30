

import Navbar from "./components/navbar";
import Landingpage from "./pages/Landingpage";

import { Routes, Route } from "react-router-dom";

import SearchPage from "./pages/SearchPage";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/adminlogin";
import ProtectedRoute from "./components/ProtectedRoute";

import AddFoundIDPage from "./pages/admin/add";
import ViewReportsPage from "./pages/ViewReportsPage";
import ManageRecordsPage from "./pages/ManageRecordsPage";
import RecordDetailsPage from "./pages/RecordDetailsPage";




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



        <Route path="/report" element={<ReportPage />} />
        <Route path="/login" element={<LoginPage />} />
        
      </Routes>
    </>
  );
}

export default App;
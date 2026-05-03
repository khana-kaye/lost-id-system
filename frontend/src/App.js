

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

import { useEffect, useState } from "react";

const API_URL = "https://lost-id-system.onrender.com/api/ids/";



function App() {
  const [ids, setIds] = useState([]);

  //fetch data from backend
   async function fetchIDs() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();


     console.log("DATA FROM BACKEND:", data);
      setIds(data); // 👈 store it
    } catch (error) {
      console.error("Error fetching IDs:", error);
    }
  }

  useEffect(() => {
    fetchIDs();
  }, []);

  return (
    <>
      <Navbar />

      {/* TEMP DEBUG VIEW (you can remove later) */}
      {/* <div style={{ padding: "10px 20px", background: "#f5f5f5" }}>
        <h4>Backend Test Data:</h4>
        <pre>{JSON.stringify(ids, null, 2)}</pre>
      </div> */}



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
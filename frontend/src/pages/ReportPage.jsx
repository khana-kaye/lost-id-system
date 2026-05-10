

import { useState } from "react";
import BASE_URL from "../api";
import { theme } from "../theme";
import PageLayout from "../components/PageLayout";



function ReportPage() {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [type, setType] = useState("National ID");
  const [location, setLocation] = useState("");
  
  //const [submitted, setSubmitted] = useState(false);
  const [notification, setNotification] = useState(null);


  const handleSubmit = async (e) => {
  e.preventDefault();
  

  // C, then F or M, then 12 alphanumeric characters
  //const ninRegex = /^C[FM][A-Za-z0-9]{12}$/;
  const ninRegex = new RegExp("^C[FM][A-Za-z0-9]{12}$");

  if (!ninRegex.test(idNumber)) {
    alert("Invalid NIN format. Example: CMXXXXXXXXXXXX");
    return;
  }


  const newReport = {
      name,
      id_number: idNumber,
      id_type: type,
      status: "Lost",
      location_found: location,
    };


    try {
      const response = await fetch(`${BASE_URL}/ids/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReport),
      });

      const data = await response.json();



      if (response.ok) {
        const msg = await response.json();

        setNotification({
          type: "success",
          message:  msg.flagged
            ? "Report submitted — WARNING: This ID was already flagged!"
            : "Report submitted successfully!"

        });

        //setSubmitted(true);

        

        // clear form
        setName("");
        setIdNumber("");
        setType("National ID");
        setLocation("");

        
      } else {
        setNotification({
          type: "error",
          message: "Failed: " + JSON.stringify(data)
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Server error - backend not reachable"
      });
    }
   };




  

  

    

    

      

      




  return (

    
    <PageLayout>
     
      <div style={{
      width: "100%",
      maxWidth: "600px"

    }}></div>
    <div style={container}>

       <div style={{
        background: theme.card,
        borderRadius: "20px",
        padding: "15px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}></div>



      <h1 style={{ color: "#0d2b4c" }}>📄 Report Found ID</h1>
      <h4 style={{ color: "#1369c5" }}>Please fill in the details to report a found ID or Drivers permit</h4>

      <form onSubmit={handleSubmit} style={form}>
        <input
          placeholder="Name on ID"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          required
        />

        <input
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
          style={input}
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={input}
        >
          <option value="National ID">National ID</option>
          <option value="Driver Permit">Driver Permit</option>
        </select>

        <input
          placeholder="Where was it found?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={input}
          required
        />

        <button type="submit" style={{
          background: theme.primary,
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "10px",
          cursor: "pointer"
        }}>
          Submit Report
        </button>
      </form>

      {/* SUCCESS MESSAGE */}
      {notification && (
        <div style={{
          ...notificationBox,
          background: notification.type === "success" ? "#e6f7ee" : "#fde8e8",
          color: notification.type === "success" ? "#0f5132" : "#842029",
          borderLeft: `5px solid ${
            notification.type === "success" ? "#28a745" : "#dc3545"
          }`
        }}>
          {notification.message}
        </div>
      )}
    </div>
    </PageLayout>
  );
}



/* STYLES */
const notificationBox = {
  marginTop: "20px",
  padding: "14px 16px",
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  fontWeight: "500",
  fontSize: "14px",
  transition: "all 0.3s ease",
};


const container = {
  padding: "40px",
  minHeight: "100vh",
  background: "#f4f6f8",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  maxWidth: "400px",
  marginTop: "20px",
};

const input = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

// const button = {
//   padding: "12px",
//   background: "#28a745",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontWeight: "bold",
// };

// const successBox = {
//   marginTop: "20px",
//   padding: "10px",
//   background: "#d4edda",
//   color: "#155724",
//   borderRadius: "6px",
// };

export default ReportPage;

 
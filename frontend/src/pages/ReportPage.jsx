

import { useState } from "react";
import BASE_URL from "../api";

function ReportPage() {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [type, setType] = useState("National ID");
  const [location, setLocation] = useState("");
  //const [submitted, setSubmitted] = useState(true);
  const [submitted] = useState(false);


  const handleSubmit = async (e) => {
  e.preventDefault();

  // CM or CF + 8 digits + 4 uppercase letters
  const ninRegex = /^C[MF]\d{8}[A-Z]{4}$/;

  if (!ninRegex.test(idNumber)) {
    alert("Invalid ID format. Example: CM12345678GE7L or CF12345678GE7L");
    return;
  }

  // continue submit logic here...


  // const handleSubmit =  async (e) => {
  //   e.preventDefault();

  //   const ninRegex = /^C[MF]\d{8}[A-Z]{3}$/;

  //   if (!ninRegex.test(idNumber)) {
  //       alert("Invalid NIN format. Example: CM12345678ABC");
  //       return;
  //   }


    const newReport = {
      name,
      id_number: idNumber,
      id_type: type,
      status: "Found",
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

      console.log("STATUS:", response.status);
      console.log("RESPONSE DATA:", data);


      if (response.ok) {
        alert("Report saved successfully!");

        //setSubmitted(true);

        // clear form
        setName("");
        setIdNumber("");
        setType("National ID");
        setLocation("");

        alert("Report saved successfully!");
      } else {
        alert("Failed: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error - backend not reachable");
    }
   };




  return (
    <div style={container}>
      <h1 style={{ color: "#0d2b4c" }}>📄 Report Found ID</h1>

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

        <button type="submit" style={button}>
          Submit Report
        </button>
      </form>

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <div style={successBox}>
          ✅ Report submitted successfully!
        </div>
      )}
    </div>
  );
}

/* STYLES */
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

const button = {
  padding: "12px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const successBox = {
  marginTop: "20px",
  padding: "10px",
  background: "#d4edda",
  color: "#155724",
  borderRadius: "6px",
};

export default ReportPage;

 
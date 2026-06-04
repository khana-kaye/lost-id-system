

 import { useState } from "react";
import BASE_URL from "../api";
import { theme } from "../theme";
import PageLayout from "../components/PageLayout";

function ReportPage() {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [type, setType] = useState("National ID");
  const [location, setLocation] = useState("");

  const [notification, setNotification] = useState(null);

  // NEW STATES (ONLY ADDITION)
  const [licenseNumber, setLicenseNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalNumber = "";

  // choose correct field
    if (type === "National ID") {
      finalNumber = idNumber;

      const ninRegex = /^C[FM][A-Za-z0-9]{12}$/;
      if (!ninRegex.test(finalNumber)) {
        alert("Invalid National ID format. Example: CMXXXXXXXXXXXX");
        return;
      }
    }

  if (type === "Driver Permit") {
    finalNumber = licenseNumber;

    const licenseRegex = /^[0-9]{6,15}$/;
    if (!licenseRegex.test(finalNumber)) {
      alert("Invalid Driver Licence Number. Must be digits only.");
      return;
    }
  }

  if (type === "ATM") {
    finalNumber = cardNumber;

    const cardRegex = /^[0-9]{10,19}$/;
    if (!cardRegex.test(finalNumber)) {
      alert("Invalid ATM Card Number. Must be digits only.");
      return;
    }
  }

  const newReport = {
    name,
    id_number: finalNumber,
    id_type: type,
    status: "Lost",
    location_found: location,
  };

  try {
    const response = await fetch(`${BASE_URL}/ids/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReport),
    });

    const data = await response.json();

    if (response.ok || response.status === 400) {
      setNotification({
        type: "success",
        message: "Report submitted successfully!",
      });

      setName("");
      setIdNumber("");
      setLicenseNumber("");
      setCardNumber("");
      setType("National ID");
      setLocation("");
    } else {
      setNotification({
        type: "error",
        message: "Failed: " + JSON.stringify(data),
      });
    }
  } catch (error) {
    setNotification({
      type: "error",
      message: "Server error - backend not reachable",
    });
  }
};

    // pick correct field based on type
  //   if (type === "Driver Permit") {
  //     finalNumber = licenseNumber;
  //   } else if (type === "ATM") {
  //     finalNumber = cardNumber;
  //   }

  //   const ninRegex = new RegExp("^C[FM][A-Za-z0-9]{12}$");

  //   if (!ninRegex.test(finalNumber)) {
  //     alert("Invalid format for selected document type");
  //     return;
  //   }

  //   const newReport = {
  //     name,
  //     id_number: finalNumber,
  //     id_type: type,
  //     status: "Lost",
  //     location_found: location,
  //   };

  //   try {
  //     const response = await fetch(`${BASE_URL}/ids/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newReport),
  //     });

  //     const data = await response.json();

  //     if (response.ok || response.status === 400) {
  //       setNotification({
  //         type: "success",
  //         message: "Report submitted successfully!",
  //       });

  //       setName("");
  //       setIdNumber("");
  //       setLicenseNumber("");
  //       setCardNumber("");
  //       setType("National ID");
  //       setLocation("");
  //     } else {
  //       setNotification({
  //         type: "error",
  //         message: "Failed: " + JSON.stringify(data),
  //       });
  //     }
  //   } catch (error) {
  //     setNotification({
  //       type: "error",
  //       message: "Server error - backend not reachable",
  //     });
  //   }
  // };

  return (
    <PageLayout>
      <div style={container}>
        <h1 style={{ color: "#0d2b4c" }}>📄 Report Found Documents</h1>

        <form onSubmit={handleSubmit} style={form}>
          <input
            placeholder="Name on ID"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
            required
          />

          {/* DOCUMENT TYPE */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={input}
          >
            <option value="National ID">National ID</option>
            <option value="Driver Permit">Driver Permit</option>
            <option value="ATM">ATM Card</option>
          </select>

          {/* CONDITIONAL INPUTS */}
          {type === "National ID" && (
            <input
              placeholder="ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
              style={input}
              required
            />
          )}

          {type === "Driver Permit" && (
            <input
              placeholder="Licence Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              style={input}
              required
            />
          )}

          {type === "ATM" && (
            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.toUpperCase())}
              style={input}
              required
            />
          )}

          <input
            placeholder="Where was it found?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={input}
            required
          />

          <button type="submit" style={submitBtn}>
            Submit Report
          </button>
        </form>

        {notification && (
          <div style={notificationBox}>{notification.message}</div>
        )}
      </div>
    </PageLayout>
  );
}

/* ONLY NEW STYLE */
const submitBtn = {
  background: theme.primary,
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
};

const notificationBox = {
  marginTop: "20px",
  padding: "14px",
  borderRadius: "12px",
  background: "#e6f7ee",
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
};

const input = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

export default ReportPage;

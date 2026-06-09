import { useState } from "react";
import BASE_URL from "../../api";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function AddFoundIDPage({ embedded }) {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [type, setType] = useState("National ID");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (type === "National ID") {
      const ninRegex = /^C[FM][A-Za-z0-9]{12}$/;

      if (!ninRegex.test(idNumber)) {
        setMessage("❌ Invalid National ID format");
        setLoading(false);
        return;
      }
    }

    if (type === "Driver Permit") {
      const permitRegex = /^[0-9]+$/;

      if (!permitRegex.test(idNumber)) {
        setMessage("❌ Driver Permit number must contain digits only");
        setLoading(false);
        return;
      }
    }

    if (type === "ATM") {
      const atmRegex = /^[0-9]+$/;

      if (!atmRegex.test(idNumber)) {
        setMessage("❌ ATM Card number must contain digits only");
        setLoading(false);
        return;
      }
    }

    const newRecord = {
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
        body: JSON.stringify(newRecord),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ ID successfully added to system");

        // reset form
        setName("");
        setIdNumber("");
        setType("National ID");
        setLocation("");
      } else {
        setMessage("❌ Failed: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Check backend.");
    }

    setLoading(false);
  };

  const content = (
    <div style={container}>
      <div style={card}>
        
        <h2 style={title}>➕ Add Found Documents</h2>
          <p style={subtitle}>Register a found Document for the police portal.</p>

          <form onSubmit={handleSubmit} style={form}>
            <input
              placeholder="Full Name on ID"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
              required
            />

            {type === "National ID" && (
              <input
                placeholder="National ID Number (CM/CF...)"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                style={input}
                required
              />
            )}

            {type === "Driver Permit" && (
              <input
                placeholder="Driver Licence Number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                style={input}
                required
              />
            )}

              {type === "ATM" && (
                <input
                  placeholder="ATM Card Number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  style={input}
                  required
                />
              )}

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={input}
            >
              <option value="National ID">National ID</option>
              <option value="Driver Permit">Driver Permit</option>
              <option value="ATM">ATM Card</option>
            </select>

            <input
              placeholder="Where was it found?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={input}
              required
            />

            <button type="submit" style={button} disabled={loading}>
              {loading ? "Saving..." : "Save ID"}
            </button>
          </form>

          {message && <p style={messageBox}>{message}</p>}
        </div>
      </div>
  );

  //return embedded ? content : <PageLayout>{content}</PageLayout>;
  return content;
}


// const container = {
//   width: "100%",
//   height: "100%",  
//   minHeight: "calc(100vh - 80px)",
//   display: "flex",
//   flexDirection: "column",
  
//   // justifyContent: "center",
// };

const container = {
  width: "100%",
  height: "calc(100vh - 140px)", 
  display: "flex",
  
};





// const card = {
//   width: "100%",
//   padding: "40px",
//   borderRadius: "16px",
//   boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//   border: "1px solid rgba(255,255,255,0.16)",
//   flex: 1,              // X
//   display: "flex",      // 
//   flexDirection: "column",
// };


const card = {
  width: "100%",
  height: "100%",          // 👈 FORCE fill container
  background: theme.card,
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  border: "1px solid rgba(255,255,255,0.16)",

  display: "flex",
  flexDirection: "column",
 
};


const title = {
  margin: 0,
  marginBottom: "8px",
  fontSize: "22px",
  color: theme.dark,
  fontWeight: "700",
};

const subtitle = {
  margin: 0,
  marginBottom: "24px",
  color: "#6b7280",
  fontSize: "13px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: "600px",
};

const input = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "13px",
  background: "rgba(255,255,255,0.35)",
  //boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

const button = {
  width: "100%",
  maxWidth: "200px",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  background: theme.primary,
  color: "white",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "8px",
  boxShadow: "0 4px 12px rgba(255,140,66,0.2)",
  
};

const messageBox = {
  marginTop: "18px",
  fontWeight: "600",
  color: "#111",
  fontSize: "13px",
};

export default AddFoundIDPage;
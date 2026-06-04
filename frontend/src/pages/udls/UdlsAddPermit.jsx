import { useState } from "react";
import BASE_URL from "../../api";
import { theme } from "../../theme";

function UdlsAddPermit() {
  const [holderName, setHolderName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("lost");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    if (!licenseNumber || !location) {
      setMessage("❌ Missing required fields");
      setIsError(true);
      setLoading(false);
      return;
    }

    const newPermit = {
  license_number: licenseNumber,   // ✅ matches model field
  holder_name: holderName || "UNKNOWN",
  location_reported: location,
  reported_by: "UDLS Staff",
};

// and the fetch URL:


    try {
      const response = await fetch(`${BASE_URL}/udls/driver-permit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPermit),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Driver permit successfully added");
        setIsError(false);

        setHolderName("");
        setLicenseNumber("");
        setLocation("");
        
      } else {
        setMessage("❌ Failed: " + (data.message || JSON.stringify(data)));
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Check backend.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      <div style={formCard}>
        <h2 style={heading}>➕ Add Driver Permit</h2>
        <p style={sub}>
          Register a recovered or reported driver permit into the UDLS system.
        </p>

        <form onSubmit={handleSubmit} style={form}>
          
          <div style={inputGroup}>
            <label style={label}>Holder Name</label>
            <input
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              style={input}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>License Number</label>
            <input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              style={input}
              placeholder="e.g. DP12345678"
              required
            />
          </div>

          

         

          
          <div style={inputGroup}>
            <label style={label}>Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={input}
              placeholder="Where was it found?"
              required
            />
          </div>

          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Saving License..." : "Save License"}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...messageBox,
              color: isError ? "#dc2626" : "#3b6d11",
              background: isError ? "#fcebeb" : "#eaf3de",
              border: isError ? "1px solid #fca5a5" : "1px solid #bbf7d0",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// ── styles (same as yours) ──
const wrapper = {
  maxWidth: "680px",
  margin: "0 auto",
  padding: "8px 0",
};

const formCard = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const heading = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: theme.dark,
};

const sub = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "6px 0 24px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#4b5563",
};

const input = {
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  outline: "none",
  color: theme.dark,
};

const btn = {
  padding: "12px 22px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
  marginTop: "10px",
  minWidth: "140px",
};

const messageBox = {
  marginTop: "20px",
  padding: "12px 16px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "13px",
};

export default UdlsAddPermit;
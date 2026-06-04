import { useState } from "react";
import BASE_URL from "../../api";
import { theme } from "../../theme";

function NiraAddIDPage() {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  //const [type, setType] = useState("National ID");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const idPattern = /^(CM|CF)[A-Za-z0-9]{12}$/;

    if (!idPattern.test(idNumber.trim().toUpperCase())) {
      setMessage(
        "❌ Invalid ID Number. It must start with CM (male) or CF (female) followed by exactly 12 letters or numbers."
      );
      setIsError(true);
      setLoading(false);
      return;
    }

    const newRecord = {
      name,
      id_number: idNumber,
      id_type: "National ID",
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
        setIsError(false);

        // Reset form fields
        setName("");
        setIdNumber("");
        //setType("National ID");
        setLocation("");
      } else {
        setMessage("❌ Failed: " + (data.message || JSON.stringify(data)));
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Check backend configuration.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      <div style={formCard}>
        <h2 style={heading}>➕ Add Found ID</h2>
        <p style={sub}>Register a recovered document directly into the system database.</p>

        <form onSubmit={handleSubmit} style={form}>
          <div style={inputGroup}>
            <label style={label}>Full Name on ID</label>
            <input
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>ID Document Number</label>
            <input
              placeholder="e.g. CM90012345ABCD"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
              style={input}
              maxLength={14}
              required
            />
            <div style={{
            fontSize: "11px",
            color: "#6b7280",
            marginTop: "4px"
          }}>
            Format: CM or CF followed by 12 letters/numbers
          </div>
          </div>


          <div style={inputGroup}>
            <label style={label}>Document Type</label>
            <input
              value="National ID"
              readOnly
              style={{
                ...input,
                background: "#f9fafb",
                color: "#6b7280",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* <div style={inputGroup}>
            <label style={label}>Document Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={selectInput}
            >
              <option value="National ID">National ID</option>
              <option value="Driver Permit">Driver Permit</option>
            </select>
          </div> */}

          <div style={inputGroup}>
            <label style={label}>Discovery Location</label>
            <input
              placeholder="Where was it found?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={input}
              required
            />
          </div>

          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Saving Record..." : "Save ID"}
          </button>
        </form>

        {message && (
          <p style={{
            ...messageBox,
            color: isError ? "#dc2626" : "#3b6d11",
            background: isError ? "#fcebeb" : "#eaf3de",
            border: isError ? "1px solid #fca5a5" : "1px solid #bbf7d0"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Styles (Scoped to blend flawlessly inside your dashboard area) ──
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
  background: "rgba(255,255,255,0.35)",
  color: theme.dark,
};

// const selectInput = {
//   ...input,
//   cursor: "pointer",
//   appearance: "none",
//   WebkitAppearance: "none",
//   background: "white url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>\") no-repeat right 12px center",
//   backgroundSize: "16px",
//   paddingRight: "40px",
// };

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
  alignSelf: "flex-start",
  minWidth: "140px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const messageBox = {
  marginTop: "20px",
  padding: "12px 16px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "13px",
  lineHeight: "1.4",
};

export default NiraAddIDPage;
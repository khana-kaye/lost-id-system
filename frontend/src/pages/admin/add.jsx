import { useState } from "react";
import BASE_URL from "../../api";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function AddFoundIDPage() {
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

  return (
    <PageLayout>
      <div style={container}>
        <div style={card}>
          <h2 style={title}>➕ Add Found ID</h2>
          <p style={subtitle}>Register a found ID for the police portal.</p>

          <form onSubmit={handleSubmit} style={form}>
            <input
              placeholder="Full Name on ID"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
              required
            />

            <input
              placeholder="ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
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

            <button type="submit" style={button} disabled={loading}>
              {loading ? "Saving..." : "Save ID"}
            </button>
          </form>

          {message && <p style={messageBox}>{message}</p>}
        </div>
      </div>
    </PageLayout>
  );
}

/* STYLES */
const container = {
  width: "100%",
  maxWidth: "540px",
  margin: "0 auto",
  padding: "24px",
};

const card = {
  background: theme.card,
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.15)",
};

const title = {
  margin: 0,
  marginBottom: "10px",
  fontSize: "28px",
  color: theme.dark,
};

const subtitle = {
  margin: 0,
  marginBottom: "24px",
  color: "#6b7280",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "15px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

const button = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "none",
  background: theme.primary,
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(255,140,66,0.25)",
};

const messageBox = {
  marginTop: "18px",
  fontWeight: "600",
  color: "#111",
};

export default AddFoundIDPage;
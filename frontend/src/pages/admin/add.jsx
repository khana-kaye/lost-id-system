import { useState } from "react";
import BASE_URL from "../../api";

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
    <div style={container}>
      <h2 style={{ color: "#0d2b4c" }}>➕ Add Found ID (Police Portal)</h2>

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
  );
}

/* STYLES */
const container = {
  padding: "40px",
  background: "#f4f6f8",
  minHeight: "100vh",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  maxWidth: "400px",
  marginTop: "20px",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const button = {
  padding: "10px",
  background: "#0d2b4c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const messageBox = {
  marginTop: "15px",
  fontWeight: "bold",
};

export default AddFoundIDPage;
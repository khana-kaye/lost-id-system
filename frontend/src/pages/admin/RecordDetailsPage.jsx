import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../api";

function RecordDetailsPage() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);

  const fetchRecord = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ids/${id}/`);
      const data = await res.json();
      setRecord(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!record) return <p>Loading...</p>;

  return (
    <div style={container}>
      <h1>📄 Record Details</h1>

      <div style={card}>
        <p><b>Name:</b> {record.name}</p>
        <p><b>ID Number:</b> {record.id_number}</p>
        <p><b>Type:</b> {record.id_type}</p>

        <p>
          <b>Status:</b>{" "}
          <span style={{ color: record.status === "Found" ? "green" : "red" }}>
            {record.status}
          </span>
        </p>

        <p><b>Location Found:</b> {record.location_found}</p>

        <p>
          <b>Date:</b>{" "}
          {record.created_at
            ? new Date(record.created_at).toLocaleString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}

const container = {
  padding: "40px",
  background: "#f4f6f8",
  minHeight: "100vh",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  maxWidth: "500px",
};

export default RecordDetailsPage;
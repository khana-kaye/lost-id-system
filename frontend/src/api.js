// Production: Render backend. Local dev: Django on port 8000.
const BASE_URL =
  (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://lost-id-backend.onrender.com/api"
    : "http://127.0.0.1:8000/api");

export default BASE_URL;

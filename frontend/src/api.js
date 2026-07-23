
const BASE_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") ||
  (import.meta.env.MODE === "production"
    ? "https://lost-id-system-1.onrender.com/api"
    : "http://127.0.0.1:8000/api");

export default BASE_URL;

const isDevEnvironment = process.env.NODE_ENV !== "production";

const defaultBase = isDevEnvironment
  ? "http://127.0.0.1:8000/api"
  : "https://lost-id-system.onrender.com/api";

const BASE_URL =
  (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "") ||
  defaultBase;

export default BASE_URL;
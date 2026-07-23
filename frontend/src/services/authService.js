import API_BASE from "../api";

const IS_DUMMY_AUTH = import.meta.env.VITE_DUMMY_AUTH === "true";

/**
 * Helper to derive user roles when in dummy authentication mode.
 */
export const deriveRoleFromUsername = (username) => {
  if (!username) return "officer";
  const u = username.toLowerCase();
  if (u.includes("nira")) return "NIRA";
  if (u.includes("bank")) return "BANK";
  if (u.includes("udls")) return "UDLS";
  return "officer";
};

/**
 * Standard Officer / General Login
 */
export async function loginOfficer(username, password) {
  if (IS_DUMMY_AUTH) {
    const role = deriveRoleFromUsername(username);
    const userData = {
      username,
      role,
      email: `${username || "dummy"}@example.local`,
    };
    return { success: true, message: "Dummy login (no backend)", userData };
  }

  try {
    const res = await fetch(`${API_BASE}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      const userData = {
        username: data.username,
        role: "officer",
        staff_id: data.staff_id,
        rank: data.rank,
        station: data.station,
        email: data.email || "",
      };

      return {
        success: true,
        message: data?.message || "Login successful",
        userData,
        rawResponse: data,
      };
    }

    return {
      success: false,
      message: data?.message || data?.detail || res.statusText || "Invalid credentials",
    };
  } catch (error) {
    console.error("Auth login error:", error);
    return {
      success: false,
      message: error?.message || "Network or backend error",
    };
  }
}

/**
 * Specialized NIRA Staff Login
 */
export async function loginNira(username, password) {
  if (IS_DUMMY_AUTH) {
    const userData = {
      username,
      staff_id: "",
      role: "NIRA",
    };
    return { success: true, message: "Dummy NIRA login (no backend)", userData };
  }

  try {
    const res = await fetch(`${API_BASE}/nira/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      const userData = {
        username: data.username,
        staff_id: data.staff_id || "",
        role: "NIRA",
      };

      return {
        success: true,
        message: data?.message || "Login successful",
        userData,
      };
    }

    return {
      success: false,
      message: data?.message || "Invalid credentials",
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Network error",
    };
  }
}
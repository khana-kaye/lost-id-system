import API_BASE from "../api";

/**
 * Standard Officer / General Login
 */
export async function loginOfficer(username, password) {
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
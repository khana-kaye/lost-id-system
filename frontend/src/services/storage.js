const USER_KEY = "user";

const AUXILIARY_KEYS = ["staff_id", "username", "rank", "station", "email"];

export const storage = {
  // Saved User Profile
  getUser: () => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user from storage:", e);
      return null;
    }
  },

  setUser: (userData) => {
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  // Store metadata keys returned by API
  setAuxiliaryData: (data) => {
    AUXILIARY_KEYS.forEach((key) => {
      if (data[key]) {
        localStorage.setItem(key, data[key]);
      }
    });
  },

  // Clear everything on logout
  clearAll: () => {
    localStorage.removeItem(USER_KEY);
    AUXILIARY_KEYS.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
  },
};
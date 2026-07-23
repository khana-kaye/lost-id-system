import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (pathOrAction) => {
    setShowAdminDropdown(false);

    if (pathOrAction === "police") {
      navigate("/login");
    } else if (pathOrAction === "report") {
      navigate("/report");
    } else if (pathOrAction === "nira") {
      navigate("/nira/login");
    } else if (pathOrAction === "banks") {
      navigate("/bank/login");
    } else {
      navigate("/udls/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-8 py-4 border-b border-gray-100 shadow-sm">
      {/* LEFT: Logo & Title */}
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-medium text-sm">
          🔍
        </div>
        <span className="text-slate-900 text-lg font-bold tracking-tight">
          Back2Owner
        </span>
      </Link>

      {/* CENTER: Navigation Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-gray-600 hover:text-slate-900 font-medium text-sm transition"
        >
          Home
        </Link>
        <Link
          to="/search"
          className="text-gray-600 hover:text-slate-900 font-medium text-sm transition"
        >
          Search IDs
        </Link>
        <Link
          to="/report"
          className="text-gray-600 hover:text-slate-900 font-medium text-sm transition"
        >
          Report
        </Link>
      </div>

      {/* RIGHT: Admin Dropdown & Emergency Action */}
      <div className="flex items-center gap-3">
        {/* ADMIN DROPDOWN WRAPPER (Attached ref here) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowAdminDropdown((prev) => !prev)}
            className="px-4 py-2 text-sm font-medium border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            Admin <span className="text-xs">▼</span>
          </button>

          {showAdminDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                type="button"
                onClick={() => handleSelect("police")}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Police Portal
              </button>
              <button
                type="button"
                onClick={() => handleSelect("nira")}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition cursor-pointer"
              >
                NIRA
              </button>
              <button
                type="button"
                onClick={() => handleSelect("banks")}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Banks
              </button>
              <button
                type="button"
                onClick={() => handleSelect("udls")}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition cursor-pointer"
              >
                UDLS
              </button>
            </div>
          )}
        </div>

        {/* Emergency Report Button */}
        <button
          type="button"
          onClick={() => navigate("/report")}
          className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition shadow-sm cursor-pointer"
        >
          Emergency Report
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
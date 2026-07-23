import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function Landingpage() {
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);

  // Refs for outside-click detection
  const portalDropdownRef = useRef(null);
  const reportDropdownRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reportDropdownRef.current &&
        !reportDropdownRef.current.contains(event.target)
      ) {
        setShowReportDropdown(false);
      }
      if (
        portalDropdownRef.current &&
        !portalDropdownRef.current.contains(event.target)
      ) {
        setShowPortalDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePortalSelect = (portal) => {
    setShowPortalDropdown(false);
    if (portal === "police") {
      navigate("/login");
    } else if (portal === "nira") {
      navigate("/nira");
    } else if (portal === "udls") {
      navigate("/udls");
    } else if (portal === "banks") {
      navigate("/bank");
    } else {
      alert(`${portal.toUpperCase()} portal coming soon!`);
    }
  };

  const handleReportSelect = (type) => {
    setShowReportDropdown(false);
    if (type === "id") {
      navigate("/report");
    } else if (type === "atm") {
      navigate("/report-atm");
    } else if (type === "permit") {
      navigate("/report-permit");
    }
  };

  return (
    <div className="font-sans">
      {/* HERO SECTION */}
      <div
        className="min-h-screen flex items-center justify-center p-8 md:p-16 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${homeImage})`,
        }}
      >
        <div className="max-w-2xl text-white z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            LOST YOUR ID, ATM CARD OR DRIVER'S PERMIT?
          </h1>

          <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
            Securely search our verified database to locate your lost
            documents. Report found documents and help reconnect people with
            their identity.
          </p>

          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            {/* SEARCH */}
            <button
              type="button"
              className="px-6 py-3 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white transition shadow-md cursor-pointer"
              onClick={() => navigate("/search")}
            >
              Search Database
            </button>

            {/* REPORT DROPDOWN WRAPPER */}
            <div className="relative" ref={reportDropdownRef}>
              <button
                type="button"
                className="px-6 py-3 rounded-lg font-semibold bg-slate-800 hover:bg-slate-900 text-white transition shadow-md cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setShowReportDropdown((prev) => !prev);
                  setShowPortalDropdown(false);
                }}
              >
                Report Found Documents <span className="text-xs">▼</span>
              </button>

              {showReportDropdown && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl min-w-[200px] z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition border-b border-gray-100 flex items-center gap-2 cursor-pointer"
                    onClick={() => handleReportSelect("id")}
                  >
                    <span>🪪</span> National ID
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition border-b border-gray-100 flex items-center gap-2 cursor-pointer"
                    onClick={() => handleReportSelect("atm")}
                  >
                    <span>💳</span> ATM Card
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
                    onClick={() => handleReportSelect("permit")}
                  >
                    <span>🚗</span> Driver's Permit
                  </button>
                </div>
              )}
            </div>

            {/* ADMIN DROPDOWN WRAPPER */}
            <div className="relative" ref={portalDropdownRef}>
              <button
                type="button"
                className="px-6 py-3 rounded-lg font-semibold border-2 border-orange-500 text-white hover:bg-orange-500/10 transition cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setShowPortalDropdown((prev) => !prev);
                  setShowReportDropdown(false);
                }}
              >
                Admin <span className="text-xs">▼</span>
              </button>

              {showPortalDropdown && (
                <div className="absolute right-0 md:left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl min-w-[180px] z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {[
                    { label: "Police Portal", key: "police" },
                    { label: "NIRA", key: "nira" },
                    { label: "Banks", key: "banks" },
                    { label: "UDLS", key: "udls" },
                  ].map(({ label, key }, i, arr) => (
                    <button
                      key={key}
                      type="button"
                      className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition cursor-pointer ${
                        i === arr.length - 1 ? "" : "border-b border-gray-100"
                      }`}
                      onClick={() => handlePortalSelect(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-20 px-8 bg-[#d3c898] text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
          How It Works
        </h2>
        <p className="text-sm md:text-base text-slate-800 max-w-2xl mx-auto mb-12 leading-relaxed">
          Back2Owner helps reunite lost documents with their rightful owners
          through a secure four-step verification process.
        </p>

        <div className="flex justify-center gap-6 flex-wrap max-w-6xl mx-auto">
          <article className="bg-white p-6 rounded-xl w-64 shadow-sm hover:shadow-md transition text-left border border-black/5">
            <h3 className="font-bold text-slate-900 mb-2 text-lg">
              🔍 1. Search
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Check if your lost document has already been submitted to our registry.
            </p>
          </article>

          <article className="bg-white p-6 rounded-xl w-64 shadow-sm hover:shadow-md transition text-left border border-black/5">
            <h3 className="font-bold text-slate-900 mb-2 text-lg">
              📢 2. Report
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Upload details of any document you find to help notify the owner.
            </p>
          </article>

          <article className="bg-white p-6 rounded-xl w-64 shadow-sm hover:shadow-md transition text-left border border-black/5">
            <h3 className="font-bold text-slate-900 mb-2 text-lg">
              🔐 3. Verify
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Relevant authorities review submissions to verify authenticity.
            </p>
          </article>

          <article className="bg-white p-6 rounded-xl w-64 shadow-sm hover:shadow-md transition text-left border border-black/5">
            <h3 className="font-bold text-slate-900 mb-2 text-lg">
              🤝 4. Reconnect
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pick up your document safely from verified handover locations.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Landingpage;
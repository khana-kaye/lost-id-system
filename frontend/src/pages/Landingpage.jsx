
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function Landingpage() {
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const navigate = useNavigate();

  // TODO: check funcitonality
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
        className="min-h-screen flex items-center justify-center p-16 bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${homeImage})` }}
      >
        <div className="max-w-xl text-white z-10">
          <h1 className="text-5xl font-extrabold mb-5 leading-tight">
            LOST YOUR ID, ATM CARD OR DRIVER'S PERMIT?
          </h1>

          <p className="text-lg md:text-xl text-gray-100 mb-6 leading-relaxed">
            Securely search our verified database to locate your lost documents. Report found
            documents and help reconnect people with their identity.
          </p>

          <div className="flex gap-4 flex-wrap">
            {/* SEARCH */}
            <button className="px-6 py-3 rounded-md font-semibold btn-primary" onClick={() => navigate("/search")}>
              Search Database
            </button>

            {/* REPORT DROPDOWN */}
            <div className="relative">
              <button
                className="px-6 py-3 rounded-md font-semibold bg-dark text-white cursor-pointer"
                onClick={() => {
                  setShowReportDropdown((prev) => !prev);
                  setShowPortalDropdown(false);
                }}
              >
                Report Found Documents ▼
              </button>

              {showReportDropdown && (
                <div className="absolute mt-2 bg-white border rounded shadow-md min-w-[180px] z-50 ">
                  <div className="px-4 py-3 text-gray-800 hover:bg-gray-50 cursor-pointer border-b" onClick={() => handleReportSelect("id")}>
                    🪪 National ID
                  </div>
                  <div className="px-4 py-3 text-gray-800 hover:bg-gray-50 cursor-pointer border-b" onClick={() => handleReportSelect("atm")}>
                    💳 ATM Card
                  </div>
                  <div className="px-4 py-3 text-gray-800 hover:bg-gray-50 cursor-pointer" onClick={() => handleReportSelect("permit")}>
                    🚗 Driver's Permit
                  </div>
                </div>
              )}
            </div>

            {/* ADMIN DROPDOWN */}
            <div className="relative">
              <button
                className="px-6 py-3 rounded-md font-semibold border-2 border-primary text-white bg-transparent cursor-pointer"
                onClick={() => {
                  setShowPortalDropdown((prev) => !prev);
                  setShowReportDropdown(false);
                }}
              >
                Admin ▼
              </button>

              {showPortalDropdown && (
                <div className="absolute mt-2 bg-white border rounded shadow-md min-w-[180px] z-50">
                  {[
                    { label: "Police Portal", key: "police" },
                    { label: "NIRA", key: "nira" },
                    { label: "Banks", key: "banks" },
                    { label: "UDLS", key: "udls" },
                  ].map(({ label, key }, i, arr) => (
                    <div
                      key={key}
                      className={`px-4 py-3 text-gray-800 hover:bg-gray-50 cursor-pointer ${i === arr.length - 1 ? '' : 'border-b'}`}
                      onClick={() => handlePortalSelect(key)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-20 px-8 bg-[#d3c898] text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">How It Works</h2>
        <p className="text-sm md:text-base text-dark max-w-2xl mx-auto mb-10">Back2Owner elps reunite lost documents with their rightful owners through a secure four-step verification process</p>

        <div className="flex justify-center gap-8 flex-wrap">
          <article className="bg-white p-6 rounded-lg w-64 shadow-md">
            <h3 className="font-semibold mb-2">Step 1: 🔍 Search</h3>
            <p className="text-sm text-muted">Check if your lost document has already been found.</p>
          </article>

          <article className="bg-white p-6 rounded-lg w-64 shadow-md">
            <h3 className="font-semibold mb-2">Step 2: 📢 Report</h3>
            <p className="text-sm text-muted">Upload any document you find to help the rightful owner.</p>
          </article>

          <article className="bg-white p-6 rounded-lg w-64 shadow-md">
            <h3 className="font-semibold mb-2">Step 3: 🔐 Verify</h3>
            <p className="text-sm text-muted">Authorities review submissions to ensure authenticity.</p>
          </article>

          <article className="bg-white p-6 rounded-lg w-64 shadow-md">
            <h3 className="font-semibold mb-2">Step 4: 🤝 Reconnect</h3>
            <p className="text-sm text-muted">Documents are returned Safely</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Landingpage;


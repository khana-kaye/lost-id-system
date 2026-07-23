import { useState } from "react";

function Topbar({ pageTitle = "", user }) {
  const [q, setQ] = useState("");

  return (
    <header className="flex w-full items-center justify-between gap-4 py-2.5">
      {/* Left side: Page Title */}
      <div className="flex items-center gap-3">
        {/* Optional Logo / Icon placeholder */}
        {/* <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0d2b4c] text-lg text-white">
          🔍
        </div> */}
        <h1 className="text-lg font-bold text-gray-900">
          {pageTitle || "Portal"}
        </h1>
      </div>

      {/* Right side: Search & User Info */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {/* <div className="hidden sm:flex items-center gap-1.5">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={() => console.log("search", q)}
            className="rounded-lg bg-[#ef8a00] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#d97d00] active:scale-95"
          >
            Search
          </button>
        </div> */}

        {/* User Badge */}
        <div className="text-xs sm:text-sm text-gray-700">
          Logged in as{" "}
          <span className="font-semibold text-gray-900">
            {user?.role || user?.username || "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
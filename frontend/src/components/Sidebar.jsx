import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({
  navGroups = [],
  orgName = "Portal",
  orgIcon = "🏷️",
  user,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const initials = (user?.name || user?.username || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Full current URL including query string (e.g., "/bank/dashboard?view=report")
  const currentFullUrl = location.pathname + location.search;

  return (
    <div className="flex h-full flex-col justify-between p-1">
      {/* Top Header & Navigation */}
      <div>
        {/* Organization Badge */}
        <div className="flex items-center gap-3 pb-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0d2b4c] text-xl text-white shadow-sm">
            {orgIcon}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold text-gray-900">
              {orgName}
            </h2>
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="mt-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.section} className="space-y-1">
              <span className="block px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {group.section}
              </span>
              {group.items.map((item) => {
                // 1. Exact match including query parameters (e.g., /bank/dashboard?view=report)
                const isExactMatch = currentFullUrl === item.route;

                // 2. Path-only match for queryless routes or sub-routes
                const isPathOnlyMatch =
                  location.pathname === item.route;

                // 3. Sub-route prefix match (e.g., /admin/users/123 under /admin/users)
                // Exclude base routes like "/admin" or "/admin/dashboard" from matching everything underneath
                const cleanRoute = item.route.split("?")[0];
                const isBaseRoute =
                  cleanRoute === "/admin" ||
                  cleanRoute === "/admin/dashboard" ||
                  cleanRoute === "/bank" ||
                  cleanRoute === "/bank/dashboard";

                const isSubRouteMatch =
                  !isBaseRoute &&
                  cleanRoute !== "" &&
                  cleanRoute !== "/" &&
                  location.pathname.startsWith(`${cleanRoute}/`);

                const isActive =
                  isExactMatch || isPathOnlyMatch || isSubRouteMatch;

                return (
                  <button
                    key={item.route}
                    onClick={() => navigate(item.route)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#ef8a00] font-semibold text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 active:bg-gray-200/60"
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer User Profile Card */}
      <div className="mt-4 border-t border-gray-200/60 pt-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0d2b4c] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold leading-tight text-gray-900">
              {user?.name || user?.username || "Officer"}
            </div>
            <div className="truncate text-xs text-gray-500">
              {user?.role || "Staff"}
            </div>
          </div>
          
          
          <button
            type="button"
            title="Logout"
            onClick={() => {
                if (onLogout) onLogout();
                navigate("/");
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
            >
            <svg
                className="h-5 w-5 fill-none stroke-current stroke-[2] [stroke-linecap:round] [stroke-linejoin:round]"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                {/* Door outline */}
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                {/* Exit Arrow */}
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
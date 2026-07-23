import PageLayout from "./PageLayout";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

function PortalLayout({
  navGroups = [],
  orgName = "Portal",
  orgIcon = "🏷️",
  pageTitle = "",
  children,
  user,
  onLogout,
  sidebarContent = null,
}) {
  return (
    <PageLayout>
      {/* Outer grid wrapper */}
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 p-3 md:grid-cols-[260px_1fr]">
        
        {/* Sidebar container */}
        <aside className="min-h-[calc(100vh-30px)]">
          {sidebarContent ? (
            sidebarContent
          ) : (
            <Sidebar
              navGroups={navGroups}
              orgName={orgName}
              orgIcon={orgIcon}
              user={user}
              onLogout={onLogout}
            />
          )}
        </aside>

        {/* Main Content Column — min-w-0 stops child elements from blowing out grid width */}
        <div className="flex min-w-0 flex-col gap-4">
          <Topbar pageTitle={pageTitle} user={user} />

          {/* Scrollable Content Container */}
          <div className="min-h-[820px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-xl bg-white/60 p-4.5 shadow-sm">
            {children}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}

export default PortalLayout;
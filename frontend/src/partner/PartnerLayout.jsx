import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  UserCircle,
  LogOut,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import "./PartnerLayout.css";

function PartnerLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let partner = null;

  try {
    const savedPartner = localStorage.getItem("ragasPartner");

    if (savedPartner) {
      partner = JSON.parse(savedPartner);
    }
  } catch (error) {
    console.error("Invalid partner data:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("ragasPartnerToken");
    localStorage.removeItem("ragasPartnerLoggedIn");
    localStorage.removeItem("ragasPartner");

    navigate("/partner-login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="partner-layout">

      {/* MOBILE TOP BAR */}
      <div className="partner-mobile-header">
        <button
          type="button"
          className="partner-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div className="partner-mobile-title">
          Partner Panel
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="partner-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`partner-sidebar ${
          sidebarOpen ? "partner-sidebar-open" : ""
        }`}
      >

        {/* SIDEBAR HEADER */}
        <div className="partner-sidebar-header">

          <div className="partner-panel-brand">
            <div className="partner-panel-brand-name">
              RAGAS
            </div>

            <div className="partner-panel-brand-subtitle">
              CAREER WORLD
            </div>
          </div>

          <button
            type="button"
            className="partner-close-btn"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>

        </div>

        {/* PARTNER INFO */}
        <div className="partner-sidebar-profile">

          <div className="partner-avatar">
            <UserCircle size={30} />
          </div>

          <div className="partner-profile-text">

            <strong>
              {partner?.companyName || "Partner"}
            </strong>

            <span>
              {partner?.email || "Partner Account"}
            </span>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="partner-sidebar-nav">

          <NavLink
            to="/partner-dashboard"
            className={({ isActive }) =>
              `partner-nav-link ${
                isActive ? "partner-nav-active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/partner-dashboard/post-job"
            className={({ isActive }) =>
              `partner-nav-link ${
                isActive ? "partner-nav-active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <PlusCircle size={18} />
            <span>Post New Job</span>
          </NavLink>

          <NavLink
            to="/partner-dashboard/jobs"
            className={({ isActive }) =>
              `partner-nav-link ${
                isActive ? "partner-nav-active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <BriefcaseBusiness size={18} />
            <span>My Jobs</span>
          </NavLink>

          <NavLink
            to="/partner-dashboard/applications"
            className={({ isActive }) =>
              `partner-nav-link ${
                isActive ? "partner-nav-active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <FileText size={18} />
            <span>Applications</span>
          </NavLink>

          <NavLink
            to="/partner-dashboard/profile"
            className={({ isActive }) =>
              `partner-nav-link ${
                isActive ? "partner-nav-active" : ""
              }`
            }
            onClick={closeSidebar}
          >
            <UserCircle size={18} />
            <span>My Profile</span>
          </NavLink>

        </nav>

        {/* LOGOUT */}
        <div className="partner-sidebar-footer">

          <button
            type="button"
            className="partner-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="partner-content">

        {/* DESKTOP TOP HEADER */}
        <header className="partner-top-header">

          <div>
            <p className="partner-top-eyebrow">
              PARTNER PORTAL
            </p>

            <h1>
              Welcome,{" "}
              {partner?.companyName || "Partner"}
            </h1>
          </div>

          <div className="partner-top-account">

            <UserCircle size={22} />

            <span>
              {partner?.contactPerson || "Partner"}
            </span>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="partner-page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default PartnerLayout;
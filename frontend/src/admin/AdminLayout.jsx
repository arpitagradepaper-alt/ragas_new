import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ragasLogo from "../assets/ragas-logo.png";
import "./AdminLayout.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let storedAdmin = null;
  try {
    storedAdmin = JSON.parse(localStorage.getItem("ragasAdmin") || "{}");
  } catch {
    storedAdmin = null;
  }

  const adminName = storedAdmin?.fullName || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("ragasAdminLoggedIn");
    window.location.href = "/admin/login";
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* MOBILE CLOSE BUTTON */}
        <button
          className="admin-mobile-close"
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          ×
        </button>

        {/* BRAND */}
        <div className="admin-brand">
          <img
            src={ragasLogo}
            alt="RAGAS Career World"
            className="admin-brand-logo"
          />

        
        </div>

        {/* ADMIN USER */}
        <div className="admin-user">
          <div className="admin-avatar">{adminName?.charAt(0)?.toUpperCase() || "A"}</div>

          <div>
            <strong>{adminName}</strong>
            <span>Administrator</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="admin-nav">

          {/* DASHBOARD */}
          <NavLink
            to="/admin"
            end
            onClick={closeSidebar}
          >
            <span>▦</span>
            Dashboard
          </NavLink>

          {/* CHATBOT LOGS */}
          <NavLink
            to="/admin/chatbot-logs"
            onClick={closeSidebar}
          >
            <span>◫</span>
            Chatbot Logs
          </NavLink>

          {/* APPLICATIONS */}
          <NavLink
            to="/admin/applications"
            onClick={closeSidebar}
          >
            <span>▤</span>
            Applications
          </NavLink>

          {/* CANDIDATES */}
          <NavLink
            to="/admin/candidates"
            onClick={closeSidebar}
          >
            <span>♙</span>
            Candidates
          </NavLink>

          {/* JOB POSTS */}
          <NavLink
            to="/admin/jobs"
            onClick={closeSidebar}
          >
            <span>▣</span>
            Job Posts
          </NavLink>

          {/* CONTACT MESSAGES */}
          <NavLink
            to="/admin/contact-messages"
            onClick={closeSidebar}
          >
            <span>✉</span>
            Contact Messages
          </NavLink>

          {/* PARTNERS */}
          <NavLink
            to="/admin/partners"
            onClick={closeSidebar}
          >
            <span>◎</span>
            Partners
          </NavLink>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="admin-sidebar-bottom">

          {/* VIEW WEBSITE */}
          <a
            href="/"
            className="admin-website-link"
            onClick={closeSidebar}
          >
            ↗ View Website
          </a>

          {/* LOGOUT */}
          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            ← Logout
          </button>

        </div>

      </aside>

      {/* RIGHT SIDE */}
      <main className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          {/* MOBILE MENU BUTTON */}
          <button
            className="admin-mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin menu"
          >
            ☰
          </button>

          <div className="admin-topbar-title">
            <p>RAGAS CAREER WORLD</p>
            <h1>Admin Panel</h1>
          </div>

          <div className="admin-system-status">
            <i></i>
            <span>System Online</span>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <div className="admin-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;
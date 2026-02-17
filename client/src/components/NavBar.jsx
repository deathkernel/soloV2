import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { path: "/dashboard",    label: "STATUS",  icon: "◈" },
  { path: "/workout",      label: "MISSION", icon: "⚔" },
  { path: "/combat-moves", label: "COMBAT",  icon: "🥊" },
  { path: "/profile",      label: "HUNTER",  icon: "◉" },
];

const ADMIN_NAV = { path: "/admin", label: "ADMIN", icon: "☠" };

function NavBar({ onLogout }) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = localStorage.getItem("role") === "admin";
  const navItems = isAdmin ? [...NAV, ADMIN_NAV] : NAV;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {navItems.map(({ path, label, icon }) => {
          const active = pathname === path;
          const isAdminTab = path === "/admin";
          return (
            <button
              key={path}
              className={`nav-item ${active ? "nav-item--active" : ""} ${isAdminTab ? "nav-item--admin" : ""}`}
              onClick={() => navigate(path)}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
              {active && <span className="nav-bar-indicator" />}
            </button>
          );
        })}
      </div>
      <button className="nav-logout" onClick={onLogout}>⏻</button>

      <style>{`
        .nav-item--admin {
          color: #ff4444 !important;
          opacity: 0.8;
        }
        .nav-item--admin.nav-item--active,
        .nav-item--admin:hover {
          opacity: 1;
          color: #ff6666 !important;
        }
        .nav-item--admin .nav-bar-indicator {
          background: #ff4444 !important;
        }
      `}</style>
    </nav>
  );
}

export default NavBar;
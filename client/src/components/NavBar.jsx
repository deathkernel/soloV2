import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { path: "/dashboard", label: "STATUS",  icon: "◈" },
  { path: "/workout",   label: "MISSION", icon: "⚔" },
  { path: "/profile",   label: "HUNTER",  icon: "◉" },
];

function NavBar({ onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {NAV.map(({ path, label, icon }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              className={`nav-item ${active ? "nav-item--active" : ""}`}
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
    </nav>
  );
}

export default NavBar;
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import AdminRegister  from "./pages/AdminRegister";
import ProfilePage    from "./pages/ProfilePage";
import WorkoutPage    from "./pages/WorkoutPage";
import DashboardPage  from "./pages/DashboardPage";
import Admin          from "./pages/Admin";
import CombatMoves    from "./pages/CombatMoves";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogin  = (t) => { localStorage.setItem("token", t); setToken(t); };
  const handleLogout = ()  => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {!token ? (
          <>
            <Route path="/"               element={<Login onLogin={handleLogin} />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="*"              element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard"    element={<DashboardPage onLogout={handleLogout} />} />
            <Route path="/workout"      element={<WorkoutPage   onLogout={handleLogout} />} />
            <Route path="/profile"      element={<ProfilePage   onLogout={handleLogout} />} />
            <Route path="/admin"        element={<Admin         onLogout={handleLogout} />} />
            <Route path="/combat-moves" element={<CombatMoves   onLogout={handleLogout} />} />
            <Route path="*"             element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:"", password:"", fullName:"", email:"", birthdate:"" });
  const [photo, setPhoto]   = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoto  = e => {
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await api.post
("/auth/register", { ...form, photo });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box auth-box-wide">

        <div className="auth-notif">
          <div className="auth-notif-dot"></div>
          <span className="auth-notif-text">NEW HUNTER REGISTRATION</span>
        </div>

        <div className="auth-panel">
          <h1 className="auth-title">CREATE HUNTER</h1>
          <p className="auth-subtitle">FILL ALL FIELDS TO AWAKEN YOUR STATUS WINDOW</p>

          <form onSubmit={handleRegister}>
            <div className="auth-grid">
              <div className="field">
                <label className="field-label">HUNTER ID</label>
                <input name="username"  placeholder="username"    onChange={handleChange} required />
              </div>
              <div className="field">
                <label className="field-label">PASSKEY</label>
                <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
              </div>
              <div className="field">
                <label className="field-label">FULL NAME</label>
                <input name="fullName"  placeholder="Full Name"   onChange={handleChange} />
              </div>
              <div className="field">
                <label className="field-label">EMAIL</label>
                <input name="email" type="email" placeholder="email@domain.com" onChange={handleChange} />
              </div>
              <div className="field">
                <label className="field-label">DATE OF BIRTH</label>
                <input name="birthdate" type="date" onChange={handleChange} />
              </div>
              <div className="field">
                <label className="field-label">HUNTER PHOTO</label>
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize:"9px" }} />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "REGISTERING..." : "AWAKEN AS HUNTER"}
            </button>
          </form>

          {error && <div className="auth-error">⚠ {error}</div>}

          <div className="auth-sep"></div>
          <p className="auth-link-row" onClick={() => navigate("/")}>← BACK TO LOGIN</p>
        </div>

      </div>
    </div>
  );
}

export default Register;
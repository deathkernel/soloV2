/**
 * PASTE THIS ENTIRE FILE into your browser DevTools console
 * while your app is open at http://localhost:5173
 *
 * It will test every relevant endpoint and show you exactly what's happening.
 */

const BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

const log = (label, ok, detail) => {
  const style = ok ? "color: #00ff88; font-weight: bold" : "color: #ff4444; font-weight: bold";
  console.log(`%c${ok ? "✓" : "✗"} ${label}`, style);
  if (detail) console.log("  →", detail);
};

(async () => {
  console.log("%c═══ SOLO SYSTEM API DIAGNOSIS ═══", "color: #00bfff; font-size: 14px; font-weight: bold");

  // 1. Token check
  log("Token in localStorage", !!token, token ? `${token.slice(0, 30)}...` : "MISSING — you need to log in first");
  if (!token) return;

  // 2. Decode token (no verify, just inspect)
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const exp = new Date(decoded.exp * 1000);
    const expired = Date.now() > decoded.exp * 1000;
    log("Token expiry", !expired, expired ? `EXPIRED at ${exp.toLocaleString()} — clear localStorage and log in again` : `Valid until ${exp.toLocaleString()}`);
    log("Token payload", true, JSON.stringify(decoded));
  } catch(e) {
    log("Token decode", false, "Token is malformed: " + e.message);
  }

  // 3. Test the profile endpoint
  console.log("\n%c─── Testing /api/auth/profile ───", "color: #00bfff");
  try {
    const r = await fetch(`${BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await r.json().catch(() => "(non-JSON response)");
    log(`GET /api/auth/profile → ${r.status}`, r.ok, JSON.stringify(body).slice(0, 200));
  } catch(e) {
    log("GET /api/auth/profile", false, `Network error — is the server running? ${e.message}`);
  }

  // 4. Test a route WITHOUT auth to see if server is alive at all
  console.log("\n%c─── Testing server reachability ───", "color: #00bfff");
  try {
    const r = await fetch(`${BASE}/workout/daily`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await r.json().catch(() => "(non-JSON)");
    log(`GET /api/workout/daily → ${r.status}`, r.ok, JSON.stringify(body).slice(0, 200));
  } catch(e) {
    log("GET /api/workout/daily", false, `Server not reachable: ${e.message}`);
  }

  // 5. Test a totally unknown route — if this also returns 404, server IS running
  //    If it returns HTML, it means something else is listening on port 5000
  console.log("\n%c─── Testing 404 catch-all (tells us if OUR server is running) ───", "color: #00bfff");
  try {
    const r = await fetch(`${BASE}/___nonexistent___`);
    const text = await r.text();
    const isOurServer = text.includes("not found") && !text.includes("<!DOCTYPE");
    log(`GET /api/___nonexistent___ → ${r.status}`, isOurServer,
      isOurServer
        ? "Our Express server is responding correctly"
        : `Unexpected response — might be wrong server. Body: ${text.slice(0, 100)}`
    );
  } catch(e) {
    log("Server reachability", false, `Nothing on port 5000: ${e.message}`);
  }

  console.log("\n%c═══ Done ═══", "color: #00bfff; font-size: 14px; font-weight: bold");
})();
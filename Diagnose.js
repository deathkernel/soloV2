/**
 * RUN THIS FROM YOUR PROJECT ROOT:
 *   node diagnose.js
 *
 * It will tell you exactly why /api/auth/profile is 404-ing.
 */

const path = require("path");
const fs   = require("fs");

console.log("\n═══════════════════════════════════════════");
console.log("  SOLO-SYSTEM SERVER DIAGNOSIS");
console.log("═══════════════════════════════════════════\n");

const checks = [];

// 1. Find where server.js actually is
const candidates = [
  "server.js",
  "server/server.js",
];
let serverFile = null;
for (const c of candidates) {
  if (fs.existsSync(path.resolve(c))) {
    serverFile = path.resolve(c);
    break;
  }
}
checks.push({
  label: "server.js location",
  ok: !!serverFile,
  detail: serverFile || "NOT FOUND — is your CWD the project root?"
});

// 2. Check root package.json main + scripts
let rootPkg = null;
try {
  rootPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
} catch { /* ignore */ }

if (rootPkg) {
  checks.push({
    label: "root package.json main",
    ok: true,
    detail: `"main": "${rootPkg.main}" — ${
      rootPkg.main === "server.js"
        ? "⚠ Points to server.js but file is at server/server.js!"
        : "OK"
    }`
  });
  checks.push({
    label: "root npm start script",
    ok: !!rootPkg.scripts?.start,
    detail: rootPkg.scripts?.start || "MISSING"
  });
}

// 3. Check that auth route file has try/catch
const authRoutePath = path.resolve("server/routes/auth.js");
if (fs.existsSync(authRoutePath)) {
  const src = fs.readFileSync(authRoutePath, "utf8");
  const hasTryCatch = src.includes("try {") && src.includes("catch");
  checks.push({
    label: "auth.js has try/catch",
    ok: hasTryCatch,
    detail: hasTryCatch
      ? "OK — errors will be caught"
      : "MISSING — Express 5 will return 404 on any async error!"
  });
}

// 4. Check User model for sparse index
const userModelPath = path.resolve("server/models/User.js");
if (fs.existsSync(userModelPath)) {
  const src = fs.readFileSync(userModelPath, "utf8");
  const hasSparse = src.includes("sparse: true") || src.includes("sparse:true");
  checks.push({
    label: "User.js has sparse indexes",
    ok: hasSparse,
    detail: hasSparse
      ? "OK — null emails won't cause duplicate key errors"
      : "MISSING — second registered user will crash with E11000 duplicate key!"
  });
}

// 5. Check server.js has global error handler
if (serverFile) {
  const src = fs.readFileSync(serverFile, "utf8");
  const hasErrorHandler = src.includes("err, req, res") || src.includes("err,req,res");
  const hasBodyLimit    = src.includes("10mb");
  checks.push({
    label: "server.js global error handler",
    ok: hasErrorHandler,
    detail: hasErrorHandler
      ? "OK"
      : "MISSING — Express 5 needs app.use((err,req,res,next)=>{}) or async errors return 404"
  });
  checks.push({
    label: "server.js json body limit",
    ok: hasBodyLimit,
    detail: hasBodyLimit ? "OK (10mb)" : "Default 100kb — photo uploads will fail with 413"
  });
}

// 6. Check MongoDB is likely reachable (just checks if mongoose is installed)
const mongoosePath = path.resolve("node_modules/mongoose");
checks.push({
  label: "mongoose installed",
  ok: fs.existsSync(mongoosePath),
  detail: fs.existsSync(mongoosePath) ? "OK" : "Run: npm install"
});

// ── Print results ────────────────────────────────────────────────────────────
let allOk = true;
for (const c of checks) {
  const icon = c.ok ? "✓" : "✗";
  if (!c.ok) allOk = false;
  console.log(`  ${icon}  ${c.label}`);
  console.log(`     ${c.detail}\n`);
}

if (allOk) {
  console.log("All checks passed. If you're still getting 404, make sure:\n");
  console.log("  1. You restarted the server AFTER replacing the files");
  console.log("  2. You're running from the correct directory:");
  console.log(`     cd ${path.resolve("server")} && node server.js`);
  console.log("  3. The token in localStorage is valid (try logging out and back in)\n");
} else {
  console.log("═══════════════════════════════════════════");
  console.log("  ACTION REQUIRED: fix the ✗ items above");
  console.log("═══════════════════════════════════════════\n");
}a
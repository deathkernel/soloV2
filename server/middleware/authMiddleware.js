const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "shadowmonarch_secret";

module.exports = function (req, res, next) {

  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ message: "No token" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");

const toUserPayload = (row) => ({
  _id: row.id,
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  location: row.location,
  phone: row.phone,
});

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query(
        "SELECT id, name, email, role, location, phone FROM users WHERE id = $1",
        [decoded.id]
      );

      if (!result.rowCount) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = toUserPayload(result.rows[0]);
      return next();
    } catch (_err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    return next();
  }
  return res.status(403).json({ message: "Employer access only" });
};

const workerOnly = (req, res, next) => {
  if (req.user && req.user.role === "worker") {
    return next();
  }
  return res.status(403).json({ message: "Worker access only" });
};

module.exports = { protect, employerOnly, workerOnly };

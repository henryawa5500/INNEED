const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

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

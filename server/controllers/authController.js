const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { query } = require("../config/db");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const normalizeEmail = (email) => String(email).toLowerCase().trim();

const toAuthPayload = (row) => ({
  _id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  phone: row.phone || "",
  location: row.location || "",
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (!["employer", "worker"].includes(role)) {
      return res.status(400).json({ message: "Role must be either employer or worker" });
    }

    const normalizedEmail = normalizeEmail(email);

    const existing = await query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rowCount) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, location, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, location, phone`,
      [
        String(name).trim(),
        normalizedEmail,
        hashedPassword,
        role,
        location ? String(location).trim() : null,
        phone ? String(phone).trim() : null,
      ]
    );

    const user = result.rows[0];

    res.status(201).json({
      ...toAuthPayload(user),
      token: generateToken(user.id),
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = normalizeEmail(email);

    const result = await query(
      "SELECT id, name, email, role, location, phone, password_hash FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (!result.rowCount) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      ...toAuthPayload(user),
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

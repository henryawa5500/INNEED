// Auth controller for Firebase
const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const USERS = "users";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    const userSnap = await db
      .collection(USERS)
      .where("email", "==", email)
      .get();
    if (!userSnap.empty) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await db.collection(USERS).add({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      phone,
      createdAt: new Date(),
    });
    const user = { id: userRef.id, name, email, role };
    res.status(201).json({ ...user, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const userSnap = await db
      .collection(USERS)
      .where("email", "==", email)
      .get();
    if (userSnap.empty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = {
      id: userDoc.id,
      name: userData.name,
      email,
      role: userData.role,
    };
    res.json({ ...user, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const userRef = await db.collection(USERS).doc(req.user.id).get();
    if (!userRef.exists)
      return res.status(404).json({ message: "User not found" });
    const user = userRef.data();
    res.json({ id: req.user.id, ...user, password: undefined });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

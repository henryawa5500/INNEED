import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../server/app");
const connectDB = require("../server/config/db");

export default async function handler(req, res) {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(500).json({ message: "Server misconfiguration: MONGO_URI is missing" });
    }

    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("API bootstrap error:", err.message);
    return res.status(500).json({ message: "Server initialization failed", error: err.message });
  }
}

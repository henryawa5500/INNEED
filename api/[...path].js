import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../server/app");
const connectDB = require("../server/config/db");

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("API bootstrap error:", err);
    return res.status(500).json({ message: "Server initialization failed" });
  }
}

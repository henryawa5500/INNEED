import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../server/app");
const { connectDB } = require("../server/config/db");

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      return res
        .status(500)
        .json({ message: "Server misconfiguration: DATABASE_URL/POSTGRES_URL is missing" });
    }

    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("API bootstrap error:", err.message);
    return res.status(500).json({ message: "Server initialization failed", error: err.message });
  }
}

const { neon } = require("@neondatabase/serverless");

let cachedClient = null;
let connectionPromise = null;

const getConnectionString = () => {
  const isProd = process.env.NODE_ENV === "production";
  const pooled = process.env.v1_DATABASE_URL || process.env.v1_POSTGRES_URL;
  const unpooled = process.env.v1_DATABASE_URL_UNPOOLED || process.env.v1_POSTGRES_URL_NON_POOLING;
  const direct = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

  if (isProd) {
    return pooled || unpooled || direct;
  }

  return unpooled || pooled || direct;
};

const getClient = () => {
  if (cachedClient) return cachedClient;

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  cachedClient = neon(connectionString);
  return cachedClient;
};

const query = async (text, params) => {
  const sql = getClient();
  const rows = await sql.query(text, params);
  return { rows, rowCount: rows.length };
};

const connectDB = async () => {
  if (connectionPromise) return connectionPromise;

  const sql = getClient();
  connectionPromise = sql.query("SELECT 1")
    .then(() => {
      console.log("Neon connected");
      return cachedClient;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

module.exports = { connectDB, query };

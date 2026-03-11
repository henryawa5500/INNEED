const { Pool } = require("pg");

let cachedPool = null;
let connectionPromise = null;

const getConnectionString = () =>
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

const getPool = () => {
  if (cachedPool) return cachedPool;

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sslRequired =
    /sslmode=require/i.test(connectionString) || process.env.PG_SSL === "true" || process.env.NODE_ENV === "production";

  cachedPool = new Pool({
    connectionString,
    max: Number(process.env.PG_POOL_MAX || 5),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.PG_CONNECT_TIMEOUT_MS || 5000),
    ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
  });

  return cachedPool;
};

const query = (text, params) => getPool().query(text, params);

const connectDB = async () => {
  if (connectionPromise) return connectionPromise;

  connectionPromise = getPool()
    .query("SELECT 1")
    .then(() => {
      console.log("Postgres connected");
      return cachedPool;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

module.exports = { connectDB, query };

const mongoose = require("mongoose");

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((instance) => {
        cachedConnection = instance.connection;
        console.log("MongoDB connected");
        return cachedConnection;
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;

const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server startup error:", err.message);
    process.exit(1);
  }
};

startServer();

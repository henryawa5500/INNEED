const express = require("express");
const router = express.Router();
const {
  getWorkers,
  getMyWorkerProfile,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} = require("../controllers/workerController");
const { protect, workerOnly } = require("../middleware/authMiddleware");

router.get("/", getWorkers);
router.get("/me", protect, workerOnly, getMyWorkerProfile);
router.get("/:id", getWorkerById);
router.post("/", protect, workerOnly, createWorker);
router.put("/:id", protect, workerOnly, updateWorker);
router.delete("/:id", protect, workerOnly, deleteWorker);

module.exports = router;

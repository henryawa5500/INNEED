// Job routes
const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, employerOnly } = require("../middleware/authMiddleware");

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, employerOnly, createJob);
router.delete("/:id", protect, employerOnly, deleteJob);

module.exports = router;

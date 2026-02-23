// Job controller for Firebase
const { db } = require("../config/firebase");

const JOBS = "jobs";

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobsSnap = await db.collection(JOBS).get();
    const jobs = jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const jobRef = await db.collection(JOBS).doc(req.params.id).get();
    if (!jobRef.exists)
      return res.status(404).json({ message: "Job not found" });
    res.json({ id: jobRef.id, ...jobRef.data() });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create new job (employer only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, category, location, salary } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const jobRef = await db.collection(JOBS).add({
      title,
      description,
      category,
      location,
      salary,
      employer: req.user.id,
      createdAt: new Date(),
    });
    const job = await jobRef.get();
    res.status(201).json({ id: job.id, ...job.data() });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete job (employer only)
exports.deleteJob = async (req, res) => {
  try {
    const jobRef = db.collection(JOBS).doc(req.params.id);
    const jobSnap = await jobRef.get();
    if (!jobSnap.exists)
      return res.status(404).json({ message: "Job not found" });
    if (jobSnap.data().employer !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }
    await jobRef.delete();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const Job = require("../models/Job");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeRequirements = (requirements) => {
  if (!requirements) return [];
  if (Array.isArray(requirements)) return requirements.map((item) => String(item).trim()).filter(Boolean);
  if (typeof requirements === "string") {
    return requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

exports.getJobs = async (req, res) => {
  try {
    const { search, category, location, type } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    }

    if (type && type !== "All") {
      filter.type = new RegExp(`^${escapeRegex(type)}$`, "i");
    }

    if (location && location !== "All") {
      filter.location = new RegExp(escapeRegex(location), "i");
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ title: regex }, { description: regex }, { category: regex }, { location: regex }];
    }

    const jobs = await Job.find(filter)
      .populate("employer", "name email phone role")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name email phone role");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, description, category, location, pay, salary, type, postedBy, requirements, contactWhatsapp } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const payValue = (pay || salary || "Negotiable").trim();
    const normalizedRequirements = normalizeRequirements(requirements);

    const job = await Job.create({
      title: String(title).trim(),
      description: String(description).trim(),
      category: category ? String(category).trim() : undefined,
      location: location ? String(location).trim() : undefined,
      pay: payValue,
      salary: payValue,
      type: type ? String(type).trim() : undefined,
      postedBy: postedBy ? String(postedBy).trim() : req.user.name,
      requirements: normalizedRequirements,
      contactWhatsapp: contactWhatsapp ? String(contactWhatsapp).trim() : req.user.phone,
      employer: req.user._id,
    });

    const createdJob = await Job.findById(job._id).populate("employer", "name email phone role");
    res.status(201).json(createdJob);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const { title, description, category, location, pay, salary, type, postedBy, requirements, contactWhatsapp } = req.body;

    if (title !== undefined) job.title = String(title).trim();
    if (description !== undefined) job.description = String(description).trim();
    if (category !== undefined) job.category = String(category).trim();
    if (location !== undefined) job.location = String(location).trim();
    if (type !== undefined) job.type = String(type).trim();
    if (postedBy !== undefined) job.postedBy = String(postedBy).trim();
    if (contactWhatsapp !== undefined) job.contactWhatsapp = String(contactWhatsapp).trim();

    if (pay !== undefined || salary !== undefined) {
      const payValue = String(pay || salary || "").trim();
      if (payValue) {
        job.pay = payValue;
        job.salary = payValue;
      }
    }

    if (requirements !== undefined) {
      job.requirements = normalizeRequirements(requirements);
    }

    await job.save();

    const updatedJob = await Job.findById(job._id).populate("employer", "name email phone role");
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

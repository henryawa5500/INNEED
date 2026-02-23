const WorkerProfile = require("../models/WorkerProfile");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((item) => String(item).trim()).filter(Boolean);
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

exports.getWorkers = async (req, res) => {
  try {
    const { search, service, location, available } = req.query;
    const filter = {};

    if (service && service !== "All") {
      filter.service = new RegExp(escapeRegex(service), "i");
    }

    if (location && location !== "All") {
      filter.location = new RegExp(escapeRegex(location), "i");
    }

    if (available === "true") filter.isAvailable = true;
    if (available === "false") filter.isAvailable = false;

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: regex }, { service: regex }, { location: regex }, { skills: regex }];
    }

    const workers = await WorkerProfile.find(filter).sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyWorkerProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Worker profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker profile not found" });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createWorker = async (req, res) => {
  try {
    const { name, service, location, bio, experience, skills, phone, whatsapp, isAvailable } = req.body;

    if (!name || !service || !location) {
      return res.status(400).json({ message: "Name, service, and location are required" });
    }

    const existingProfile = await WorkerProfile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(409).json({ message: "You already have a worker profile" });
    }

    const worker = await WorkerProfile.create({
      user: req.user._id,
      name: String(name).trim(),
      service: String(service).trim(),
      location: String(location).trim(),
      bio: bio ? String(bio).trim() : "",
      experience: experience ? String(experience).trim() : "",
      skills: normalizeSkills(skills),
      phone: phone ? String(phone).trim() : req.user.phone,
      whatsapp: whatsapp ? String(whatsapp).trim() : req.user.phone,
      isAvailable: isAvailable === undefined ? true : Boolean(isAvailable),
    });

    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker profile not found" });

    if (worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const { name, service, location, bio, experience, skills, phone, whatsapp, isAvailable } = req.body;

    if (name !== undefined) worker.name = String(name).trim();
    if (service !== undefined) worker.service = String(service).trim();
    if (location !== undefined) worker.location = String(location).trim();
    if (bio !== undefined) worker.bio = String(bio).trim();
    if (experience !== undefined) worker.experience = String(experience).trim();
    if (phone !== undefined) worker.phone = String(phone).trim();
    if (whatsapp !== undefined) worker.whatsapp = String(whatsapp).trim();
    if (isAvailable !== undefined) worker.isAvailable = Boolean(isAvailable);
    if (skills !== undefined) worker.skills = normalizeSkills(skills);

    await worker.save();
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker profile not found" });

    if (worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this profile" });
    }

    await worker.deleteOne();
    res.json({ message: "Worker profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

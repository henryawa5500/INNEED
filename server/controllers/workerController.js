const { query } = require("../config/db");

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

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

const mapWorkerRow = (row) => ({
  id: row.id,
  user: row.user_id,
  name: row.name,
  service: row.service,
  location: row.location,
  bio: row.bio,
  experience: row.experience,
  skills: row.skills || [],
  phone: row.phone,
  whatsapp: row.whatsapp,
  rating: row.rating === null || row.rating === undefined ? 0 : Number(row.rating),
  jobsDone: row.jobs_done === null || row.jobs_done === undefined ? 0 : Number(row.jobs_done),
  isAvailable: row.is_available,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const fetchWorkerById = async (id) => {
  const result = await query(
    `SELECT
        id,
        user_id,
        name,
        service,
        location,
        bio,
        experience,
        skills,
        phone,
        whatsapp,
        rating,
        jobs_done,
        is_available,
        created_at,
        updated_at
      FROM worker_profiles
      WHERE id = $1`,
    [id]
  );

  if (!result.rowCount) return null;
  return mapWorkerRow(result.rows[0]);
};

exports.getWorkers = async (req, res) => {
  try {
    const { search, service, location, available } = req.query;
    const filters = [];
    const values = [];
    let index = 1;

    if (service && service !== "All") {
      filters.push(`service ILIKE $${index}`);
      values.push(`%${service}%`);
      index += 1;
    }

    if (location && location !== "All") {
      filters.push(`location ILIKE $${index}`);
      values.push(`%${location}%`);
      index += 1;
    }

    if (available === "true") {
      filters.push("is_available = TRUE");
    }

    if (available === "false") {
      filters.push("is_available = FALSE");
    }

    if (search) {
      filters.push(
        `(name ILIKE $${index} OR service ILIKE $${index} OR location ILIKE $${index} OR EXISTS (SELECT 1 FROM unnest(skills) s WHERE s ILIKE $${index}))`
      );
      values.push(`%${search}%`);
      index += 1;
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const result = await query(
      `SELECT
          id,
          user_id,
          name,
          service,
          location,
          bio,
          experience,
          skills,
          phone,
          whatsapp,
          rating,
          jobs_done,
          is_available,
          created_at,
          updated_at
        FROM worker_profiles
        ${whereClause}
        ORDER BY created_at DESC`,
      values
    );

    res.json(result.rows.map(mapWorkerRow));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyWorkerProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const result = await query(
      `SELECT
          id,
          user_id,
          name,
          service,
          location,
          bio,
          experience,
          skills,
          phone,
          whatsapp,
          rating,
          jobs_done,
          is_available,
          created_at,
          updated_at
        FROM worker_profiles
        WHERE user_id = $1`,
      [userId]
    );

    if (!result.rowCount) return res.status(404).json({ message: "Worker profile not found" });
    res.json(mapWorkerRow(result.rows[0]));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await fetchWorkerById(req.params.id);
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

    const userId = req.user.id || req.user._id;
    const existingProfile = await query("SELECT id FROM worker_profiles WHERE user_id = $1", [userId]);

    if (existingProfile.rowCount) {
      return res.status(409).json({ message: "You already have a worker profile" });
    }

    const result = await query(
      `INSERT INTO worker_profiles (
        user_id,
        name,
        service,
        location,
        bio,
        experience,
        skills,
        phone,
        whatsapp,
        is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [
        userId,
        String(name).trim(),
        String(service).trim(),
        String(location).trim(),
        bio ? String(bio).trim() : "",
        experience ? String(experience).trim() : "",
        normalizeSkills(skills),
        phone ? String(phone).trim() : req.user.phone,
        whatsapp ? String(whatsapp).trim() : req.user.phone,
        isAvailable === undefined ? true : parseBoolean(isAvailable),
      ]
    );

    const worker = await fetchWorkerById(result.rows[0].id);
    res.status(201).json(worker);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "You already have a worker profile" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const ownership = await query("SELECT user_id FROM worker_profiles WHERE id = $1", [id]);
    if (!ownership.rowCount) return res.status(404).json({ message: "Worker profile not found" });

    if (ownership.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const { name, service, location, bio, experience, skills, phone, whatsapp, isAvailable } = req.body;

    const updates = [];
    const values = [];
    let index = 1;

    const pushUpdate = (column, value) => {
      updates.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    };

    if (name !== undefined) pushUpdate("name", String(name).trim());
    if (service !== undefined) pushUpdate("service", String(service).trim());
    if (location !== undefined) pushUpdate("location", String(location).trim());
    if (bio !== undefined) pushUpdate("bio", String(bio).trim());
    if (experience !== undefined) pushUpdate("experience", String(experience).trim());
    if (phone !== undefined) pushUpdate("phone", String(phone).trim());
    if (whatsapp !== undefined) pushUpdate("whatsapp", String(whatsapp).trim());
    if (skills !== undefined) pushUpdate("skills", normalizeSkills(skills));

    if (isAvailable !== undefined) {
      pushUpdate("is_available", parseBoolean(isAvailable));
    }

    if (!updates.length) {
      const current = await fetchWorkerById(id);
      return res.json(current);
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await query(`UPDATE worker_profiles SET ${updates.join(", ")} WHERE id = $${index}`, values);

    const updatedWorker = await fetchWorkerById(id);
    res.json(updatedWorker);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const ownership = await query("SELECT user_id FROM worker_profiles WHERE id = $1", [id]);
    if (!ownership.rowCount) return res.status(404).json({ message: "Worker profile not found" });

    if (ownership.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this profile" });
    }

    await query("DELETE FROM worker_profiles WHERE id = $1", [id]);
    res.json({ message: "Worker profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

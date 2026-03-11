const { query } = require("../config/db");

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Gig", "Live-In", "Temporary"];

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

const mapJobRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  location: row.location,
  pay: row.pay,
  salary: row.salary,
  type: row.type,
  postedBy: row.posted_by,
  requirements: row.requirements || [],
  contactWhatsapp: row.contact_whatsapp,
  employer: row.employer_id
    ? {
        _id: row.employer_id,
        id: row.employer_id,
        name: row.employer_name,
        email: row.employer_email,
        phone: row.employer_phone,
        role: row.employer_role,
      }
    : null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const fetchJobById = async (id) => {
  const result = await query(
    `SELECT
        j.id,
        j.title,
        j.description,
        j.category,
        j.location,
        j.pay,
        j.salary,
        j.type,
        j.posted_by,
        j.requirements,
        j.contact_whatsapp,
        j.created_at,
        j.updated_at,
        u.id AS employer_id,
        u.name AS employer_name,
        u.email AS employer_email,
        u.phone AS employer_phone,
        u.role AS employer_role
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE j.id = $1`,
    [id]
  );

  if (!result.rowCount) return null;
  return mapJobRow(result.rows[0]);
};

exports.getJobs = async (req, res) => {
  try {
    const { search, category, location, type } = req.query;
    const filters = [];
    const values = [];
    let index = 1;

    if (category && category !== "All") {
      filters.push(`LOWER(j.category) = LOWER($${index})`);
      values.push(category);
      index += 1;
    }

    if (type && type !== "All") {
      filters.push(`LOWER(j.type) = LOWER($${index})`);
      values.push(type);
      index += 1;
    }

    if (location && location !== "All") {
      filters.push(`j.location ILIKE $${index}`);
      values.push(`%${location}%`);
      index += 1;
    }

    if (search) {
      filters.push(
        `(j.title ILIKE $${index} OR j.description ILIKE $${index} OR j.category ILIKE $${index} OR j.location ILIKE $${index})`
      );
      values.push(`%${search}%`);
      index += 1;
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const result = await query(
      `SELECT
          j.id,
          j.title,
          j.description,
          j.category,
          j.location,
          j.pay,
          j.salary,
          j.type,
          j.posted_by,
          j.requirements,
          j.contact_whatsapp,
          j.created_at,
          j.updated_at,
          u.id AS employer_id,
          u.name AS employer_name,
          u.email AS employer_email,
          u.phone AS employer_phone,
          u.role AS employer_role
        FROM jobs j
        JOIN users u ON j.employer_id = u.id
        ${whereClause}
        ORDER BY j.created_at DESC`,
      values
    );

    res.json(result.rows.map(mapJobRow));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await fetchJobById(req.params.id);
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

    if (type && !JOB_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid job type" });
    }

    const payValue = String(pay || salary || "Negotiable").trim();
    const normalizedRequirements = normalizeRequirements(requirements);
    const userId = req.user.id || req.user._id;

    const result = await query(
      `INSERT INTO jobs (
        title,
        description,
        category,
        location,
        pay,
        salary,
        type,
        posted_by,
        requirements,
        contact_whatsapp,
        employer_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        String(title).trim(),
        String(description).trim(),
        category ? String(category).trim() : "General",
        location ? String(location).trim() : "Remote",
        payValue,
        payValue,
        type ? String(type).trim() : "Full-Time",
        postedBy ? String(postedBy).trim() : req.user.name,
        normalizedRequirements,
        contactWhatsapp ? String(contactWhatsapp).trim() : req.user.phone,
        userId,
      ]
    );

    const createdJob = await fetchJobById(result.rows[0].id);
    res.status(201).json(createdJob);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const ownership = await query("SELECT employer_id FROM jobs WHERE id = $1", [id]);
    if (!ownership.rowCount) return res.status(404).json({ message: "Job not found" });

    if (ownership.rows[0].employer_id !== userId) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const { title, description, category, location, pay, salary, type, postedBy, requirements, contactWhatsapp } = req.body;

    if (type && !JOB_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid job type" });
    }

    const updates = [];
    const values = [];
    let index = 1;

    const pushUpdate = (column, value) => {
      updates.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    };

    if (title !== undefined) pushUpdate("title", String(title).trim());
    if (description !== undefined) pushUpdate("description", String(description).trim());
    if (category !== undefined) pushUpdate("category", String(category).trim());
    if (location !== undefined) pushUpdate("location", String(location).trim());
    if (type !== undefined) pushUpdate("type", String(type).trim());
    if (postedBy !== undefined) pushUpdate("posted_by", String(postedBy).trim());
    if (contactWhatsapp !== undefined) pushUpdate("contact_whatsapp", String(contactWhatsapp).trim());

    if (pay !== undefined || salary !== undefined) {
      const payValue = String(pay || salary || "").trim();
      if (payValue) {
        pushUpdate("pay", payValue);
        pushUpdate("salary", payValue);
      }
    }

    if (requirements !== undefined) {
      pushUpdate("requirements", normalizeRequirements(requirements));
    }

    if (!updates.length) {
      const current = await fetchJobById(id);
      return res.json(current);
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await query(`UPDATE jobs SET ${updates.join(", ")} WHERE id = $${index}`, values);

    const updatedJob = await fetchJobById(id);
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const ownership = await query("SELECT employer_id FROM jobs WHERE id = $1", [id]);
    if (!ownership.rowCount) return res.status(404).json({ message: "Job not found" });

    if (ownership.rows[0].employer_id !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await query("DELETE FROM jobs WHERE id = $1", [id]);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

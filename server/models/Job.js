const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "General" },
    location: { type: String, trim: true, default: "Remote" },
    pay: { type: String, trim: true, default: "Negotiable" },
    // Legacy field kept for backward compatibility
    salary: { type: String, trim: true },
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Gig", "Live-In", "Temporary"],
      default: "Full-Time",
    },
    postedBy: { type: String, trim: true },
    requirements: { type: [String], default: [] },
    contactWhatsapp: { type: String, trim: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

jobSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Job", jobSchema);

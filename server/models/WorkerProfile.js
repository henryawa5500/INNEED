const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, default: "" },
    experience: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    phone: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    jobsDone: { type: Number, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

workerProfileSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);

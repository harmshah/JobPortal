import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract"],
    default: "Full-time",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    default: null,
  },
  // ✅ Add this field:
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
const Job = mongoose.model("Job", jobSchema);
export default Job;

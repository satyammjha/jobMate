import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  job_id: { type: String, required: true },
  job_title: { type: String, required: true },
  company_name: { type: String },
  company_id: { type: Number },
  company_logo: { type: String },
  experience: { type: String },
  salary: { type: String, default: "Not disclosed" },
  location: { type: String },
  job_url: { type: String },
  static_url: { type: String },
  skills: [{ type: String }],
  job_description: { type: String, default: "No description available" },
  date_posted: { type: String },
  footer_label: { type: String },
  currency: { type: String },
  is_saved: { type: Boolean, default: false },
  group_id: { type: Number },
  is_top_group: { type: Number },
  board: { type: String },
  mode: { type: String },
  company_rating: { type: String },
  company_reviews_count: { type: Number },
  company_reviews_url: { type: String },
  scraped_date: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model("jobs", JobSchema);
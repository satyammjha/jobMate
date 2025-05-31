import mongoose from "mongoose";

const SavedJobSchema = new mongoose.Schema({
    jobId: { type: String },
    title: { type: String },
    company: { type: String },
    location: { type: String },
    salary: { type: String, default: "Not Disclosed" },
    experience: { type: String, default: "Not Mentioned" },
    posted: { type: String, default: "Unknown" },
    link: { type: String },
    source: { type: String },
    tags: [{ type: String }],
    savedDate: { type: Date, default: Date.now },
    description: { type: String, default: "No description available" },
    logo: { type: String },
    expiryDate: { type: Date },
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    referralCode: { type: String, unique: true, sparse: true },
    referralCount: { type: Number, default: 0 },
    aiCredits: { type: Number, default: 0 },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isVerified: { type: Boolean, default: false },
    clerkUserId: { type: String, unique: true },
    savedJobs: { type: [SavedJobSchema], default: [] },
    createdAt: { type: Date, default: Date.now, required: false },
    notifyAboutExpiringJobs: { type: Boolean, default: false },
    resumeUploads: { type: Number, default: 0 },
    resumeUploadTimestamp: { type: Date },
    lastRefillDate: { type: Date },
    notifications: [
  {
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }
],
});

const newsLetterSchema = new mongoose.Schema({
  email:{type:String, required:true},
  subscribedAt: { type: Date, default: Date.now },
  isSubscribed: { type: Boolean, default: true },
  unsubscribedAt: { type: Date },
});


UserSchema.index({ email: 1 });

export default mongoose.model("User", UserSchema);
export const NewsLetter = mongoose.model("NewsLetter", newsLetterSchema);
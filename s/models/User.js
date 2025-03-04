import mongoose from "mongoose";

const SavedJobSchema = new mongoose.Schema({
    jobId: { type: String }, 
    title: { type: String},
    company: { type: String},
    location: { type: String },
    salary: { type: String, default: "Not Disclosed" },
    experience: { type: String, default: "Not Mentioned"},
    posted: { type: String, default: "Unknown" },
    link: { type: String }, 
    source: { type: String}, 
    tags: [{ type: String}],
    savedDate: { type: Date, default: Date.now },
    description: { type: String, default: "No description available"},
    logo: { type: String},
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    referralCode: { type: String, unique: true, sparse: true },
    referralCount: { type: Number, default: 0 },
    aiCredits: { type: Number, default: 0 },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isVerified: { type: Boolean, default: false },
    savedJobs: { type: [SavedJobSchema], default: [] }, 
    createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ email: 1 });

export default mongoose.model("User", UserSchema);

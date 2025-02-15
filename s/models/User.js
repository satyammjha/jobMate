import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    referralCode: { type: String, unique: true },
    referralCount: { type: Number, default: 0 },
    aiCredits: { type: Number, default: 0 }, 
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
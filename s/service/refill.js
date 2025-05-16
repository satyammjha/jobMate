import mongoose from "mongoose";
import cron from "node-cron";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "../.env" });
const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI);
}

(async () => {
    await connectDB();
    console.log("Connected to MongoDB");

    try {
        const cutoff = new Date(Date.now() - 60 * 60 * 1000);

        const usersToRefill = await User.find({
            aiCredits: 0,
            $or: [
                { lastRefillDate: { $lte: cutoff } },
                { lastRefillDate: { $exists: false } }
            ]
        });

        for (const user of usersToRefill) {
            user.aiCredits = 50;
            user.lastRefillDate = new Date();

           user.notifications.push({
    message: 'Your AI credits have been refilled to 50.',
});

           

            await user.save();
        }

        console.log(`📦 Refilled credits for ${usersToRefill.length} users`);
    } catch (err) {
        console.error('❌ Error in refill cron:', err);
    } finally {
        process.exit(); // exit after one-time run
    }
})();

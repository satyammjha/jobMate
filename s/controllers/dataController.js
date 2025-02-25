import mongoose from "mongoose";
import User from "../models/User.js";


const fetchUserData = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        res.status(200).json({ message: "User found successfully", user });
    }
    catch (error) {
        console.error("Error in fetchUserData:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const fetchRefferalList = async (req, res) => {
    try {
        let users = await User.find();
        let referralCounts = users.map(user => ({
            name: user.name,
            email: user.email,
            referralCode: user.referralCode,
            referralCount: user.referralCount
        }));

        referralCounts.sort((a, b) => b.referralCount - a.referralCount);

        res.status(200).json({ message: "Referral leaderboard fetched successfully", referralCounts });
    } catch (error) {
        console.error("Error in fetchRefferalList:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const fetchJobsData = async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            return res.status(500).json({ message: "Database not connected" });
        }

        const ndDb = mongoose.connection.client.db("nd");
        const gdDb = mongoose.connection.client.db("gdjd");

        const naukriJobs = await ndDb.collection("nds").find().limit(5).toArray();
        const gdJobs = await gdDb.collection("jds").find().limit(5).toArray();

        res.status(200).json({
            message: "Jobs data fetched successfully",
            naukriJobs,
            gdJobs,
        });
    } catch (error) {
        console.error("Error fetching job data:", error);
        res.status(500).json({ message: "Error fetching job data", error: error.message });
    }
};




export { fetchRefferalList, fetchUserData, fetchJobsData };
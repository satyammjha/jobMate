import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * @desc    Fetch user data by email
 * @route   POST /api/user
 * @access  Public
 */
const fetchUserData = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        let user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        res.status(200).json({ message: "User found successfully", user });
    } catch (error) {
        console.error("Error in fetchUserData:", error.stack);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * @desc    Fetch referral leaderboard
 * @route   GET /api/referrals
 * @access  Public
 */
const fetchReferralList = async (req, res) => {
    try {
        let referralCounts = await User.find()
            .select("name email referralCode referralCount")
            .sort({ referralCount: -1 })
            .lean();

        res.status(200).json({ message: "Referral leaderboard fetched successfully", referralCounts });
    } catch (error) {
        console.error("Error in fetchReferralList:", error.stack);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * @desc    Fetch jobs from multiple sources
 * @route   GET /api/jobs
 * @access  Public
 */

const fetchJobsData = async (parameters = {}) => {
    console.log("Params recd:", parameters);
    try {
        if (!mongoose.connection || mongoose.connection.readyState !== 1) {
            console.error("❌ Database connection error");
            return { error: "Database not connected" };
        }

        console.log("🔍 Fetching jobs...");

        const ndDb = mongoose.connection.client.db("nd");
        const gdDb = mongoose.connection.client.db("gdjd");

        let query = {};

        if (parameters.title) {
            query.title = { $regex: new RegExp(parameters.title, "i") };
        }
        if (parameters.company) {
            query.company = { $regex: new RegExp(parameters.company, "i") };
        }

        let naukriJobs = [], gdJobs = [];

        if (!parameters.platform || parameters.platform.toLowerCase() === "naukri") {
            naukriJobs = await ndDb.collection("nds").find(query).limit(100).toArray();
        }
        if (!parameters.platform || parameters.platform.toLowerCase() === "glassdoor") {
            gdJobs = await gdDb.collection("jds").find(query).limit(100).toArray();
        }

        return { message: "Jobs fetched successfully", naukriJobs, gdJobs };

    } catch (error) {
        console.error("❌ Error fetching job data:", error.stack);
        return { error: "Error fetching job data", details: error.message };
    }
};


// Extracts numeric salary from string
const extractSalary = (salaryString) => {
    const match = salaryString.match(/₹(\d+)L/);
    return match ? parseInt(match[1]) : null;
};
/**
 * @desc    Save jobs to user's savedJobs array
 * @route   POST /api/jobs/save
 * @access  Public
 */
const saveJobs = async (req, res) => {
    try {
        const { email, jobs } = req.body;

        if (!email || !jobs || !Array.isArray(jobs)) {
            return res.status(400).json({ error: "Invalid request format" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newJobs = jobs.filter(job =>
            !user.savedJobs.some(savedJob => savedJob.jobId === job.jobId)
        );

        if (newJobs.length === 0) {
            return res.status(400).json({ error: "All jobs are already saved" });
        }

        user.savedJobs.push(...newJobs);
        await user.save();

        res.status(201).json({ message: "Jobs saved successfully", savedJobs: user.savedJobs });
    } catch (error) {
        console.error("Error saving jobs:", error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @desc    Fetch saved jobs for a user
 * @route   GET /api/jobs/saved
 * @access  Public
 */
const getSavedJobs = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email }).select("savedJobs").lean();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ savedJobs: user.savedJobs });
    } catch (error) {
        console.error("Error fetching saved jobs:", error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};



const deleteSavedJobs = async (req, res) => {
    try {
        const { email, jobs } = req.body; 

        if (!email || !jobs || !Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({ error: "Invalid delete request format" });
        }

        const user = await User.findOneAndUpdate(
            { email: email },
            { $pull: { savedJobs: { jobId: { $in: jobs } } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Jobs removed successfully", user });
    } catch (error) {
        console.error("Error deleting saved jobs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export { fetchUserData, fetchReferralList, fetchJobsData, saveJobs, getSavedJobs, deleteSavedJobs };
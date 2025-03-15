import express from "express";
import { fetchReferralList, fetchUserData, fetchJobsData, getSavedJobs, saveJobs, deleteSavedJobs } from "../controllers/dataController.js";
const dataRouter = express.Router();


dataRouter.get("/fetchRefferalList", fetchReferralList);
dataRouter.post("/fetchUserData", fetchUserData);
dataRouter.get("/fetchJobsData", async (req, res) => {
    try {
        const parameters = req.body;
        const jobs = await fetchJobsData(parameters);
        
        if (jobs.error) {
            return res.status(500).json(jobs);
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error("❌ Error in /fetchJobsData route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

dataRouter.post("/jobs/save", saveJobs);
dataRouter.get("/jobs/saved", getSavedJobs);
dataRouter.delete("/jobs/delete", deleteSavedJobs);
export default dataRouter;
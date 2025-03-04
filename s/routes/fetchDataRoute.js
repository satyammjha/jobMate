import express from "express";
import { fetchReferralList, fetchUserData, fetchJobsData, getSavedJobs, saveJobs } from "../controllers/dataController.js";

const dataRouter = express.Router();

dataRouter.get("/fetchRefferalList", fetchReferralList);
dataRouter.post("/fetchUserData", fetchUserData);
dataRouter.get("/fetchJobsData", fetchJobsData);
dataRouter.post("/jobs/save", saveJobs);
dataRouter.get("/jobs/saved", getSavedJobs);
export default dataRouter;
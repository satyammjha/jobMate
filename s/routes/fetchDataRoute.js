import express from "express";
import { fetchRefferalList, fetchUserData, fetchJobsData } from "../controllers/dataController.js";

const dataRouter = express.Router();

dataRouter.get("/fetchRefferalList", fetchRefferalList);
dataRouter.post("/fetchUserData", fetchUserData);
dataRouter.get("/fetchJobsData", fetchJobsData);
export default dataRouter;
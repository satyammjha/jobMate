import express from "express";
import { fetchRefferalList, fetchUserData } from "../controllers/dataController.js";

const dataRouter = express.Router();

dataRouter.get("/fetchRefferalList", fetchRefferalList);
dataRouter.post("/fetchUserData", fetchUserData);

export default dataRouter;
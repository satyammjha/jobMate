import express from "express";
import { fetchRefferalList, fetchUserData } from "../controllers/dataController.js";

const router = express.Router();

router.get("/fetchRefferalList", fetchRefferalList);
router.post("/fetchUserData", fetchUserData);

export default router;
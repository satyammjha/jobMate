import express from "express";
import creditController from "../controllers/creditsController.js";

const creditsRoute = express.Router();

creditsRoute.post("/", creditController);

export default creditsRoute;
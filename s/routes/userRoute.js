import { Router } from "express";
import { requireAuth } from "@clerk/express";
import addUserController from "../controllers/userController.js";

const userRouter = Router();
userRouter.post("/", requireAuth({
  redirectTo: false,
  onError: (err, req, res, next) => {
    console.log("Authentication error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}), (req, res, next) => {
  console.log("🔹 Authentication successful");
  console.log("🔹 User ID:", req.auth.userId);
  next();
}, addUserController);

export default userRouter;
import { Router } from "express";
import addUserController from "../controllers/userController.js";
console.log('🔹 userRoute reached');
const userRouter = Router();

userRouter.post('/', addUserController);

export default userRouter
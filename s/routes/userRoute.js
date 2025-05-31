import express from "express";
import addUserController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.use((req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization || "No Authorization Header");

  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  else {
    next();
  }

});

userRouter.post("/", addUserController);

userRouter.all("*", (req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl} inside userRouter.js`,
    error: "Route not found"
  });
});

export default userRouter;
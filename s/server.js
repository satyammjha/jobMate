import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbConnection from "./config/db.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/user", userRouter);

const startServer = async () => {
    try {
        await dbConnection();
        console.log("✅ Database connected successfully.");

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

startServer();
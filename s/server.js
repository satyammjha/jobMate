import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import dataRouter from "./routes/fetchDataRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.get("/", (req, res) => {
    res.send("zobly-api-action successful");
})
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
})
const startServer = async () => {
    try {
        await dbConnection();
        console.log("Database connected successfully.");

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

startServer();
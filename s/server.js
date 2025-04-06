import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import dataRouter from "./routes/fetchDataRoute.js";
import emailRouter from "./routes/emailRoutes.js";
import jobMatchingRouter from "./routes/jobMatchingRoute.js";
import router from "./routes/agentRoutes.js";
import creditsRoute from "./routes/creditControlRoutes.js";
import { requestProfilerMiddleware } from "expresseye";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    requestProfilerMiddleware({
        logTo: "console",
        threshold: 300
    })
)


app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/notify", emailRouter);
app.use("/match", jobMatchingRouter);
app.use("/credit", creditsRoute);
app.use("/", router);

app.get("/", (req, res) => {
    res.status(200).json({ message: "zobly-api-is-working-fine" });
})
app.get("/cicd", (req, res) => {
    res.send("CI/CD pipeline is working fine && updated the notify api");
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
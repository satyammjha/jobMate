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
import uploadPdfRoute from "./routes/uploadPdf.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Apply middleware
// app.use(
//   requestProfilerMiddleware({
//     logTo: "console",
//     threshold: 300
//   })
// );

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Register routes
// Important: Make sure userRouter is mounted correctly
app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/notify", emailRouter);
app.use("/match", jobMatchingRouter);
app.use("/credit", creditsRoute);
app.use("/upload", uploadPdfRoute);
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })
// app.use("/", router);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Handle 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.path}`, error: "Route not found" });
});

const startServer = async () => {
  try {
    await dbConnection();

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
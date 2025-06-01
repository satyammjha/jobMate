import express from "express";
import processPdf from "../controllers/uploadPdf.controller.js";
import { upload } from "../service/uploadData.js";


const router = express.Router();

router.post("/uploadPdf", upload.single('file'), processPdf);

export default router;
import extractText from "../service/extractText.js";
import fs from "fs";
import { generateResumeReview } from "../service/GetGeminiResponse.js";

const processPdf = async (req, res) => {
    try {
        const file = req.file;
        const user = req.email

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        console.log('Processing file:', file.originalname, 'Type:', file.mimetype);
        const extractedText = await extractText(file);

        try {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (cleanupError) {
            console.warn('Warning: Could not delete temporary file:', cleanupError.message);
        }

        if (extractedText) {
            const response = await generateResumeReview(extractedText, 'full');

            return res.status(200).json(response);
        }

        return res.status(200).json({
            success: true,
            message: "File processed but no text extracted",
            text: extractedText
        });

    } catch (error) {
        console.error("Error processing file:", error);
        try {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cleanupError) {
            console.warn('Warning: Could not delete temporary file after error:', cleanupError.message);
        }

        return res.status(500).json({
            success: false,
            message: "Error processing file",
            error: error.message
        });
    }
};

export default processPdf;
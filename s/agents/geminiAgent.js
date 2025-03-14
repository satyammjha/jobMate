import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.0-flash",
    maxOutputTokens: 2048,
    apiKey: process.env.GOOGLE_API_KEY,
});

const askGemini = async (query) => {
    console.log("Gemini Agent", query);
    try {
        if (!query) {
            return "Query is required"
        }

        const response = await model.invoke(query);
        return response;
    } catch (error) {
        console.error("Error:", error);
    }
};

export { askGemini };
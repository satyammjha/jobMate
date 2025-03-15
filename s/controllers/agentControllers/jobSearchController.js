import { detectSimpleIntent } from "../../utility/detectSimpleIntent.js";
import { fetchJobsData, saveJobs } from "../dataController.js";
import { askGemini } from "../../agents/geminiAgent.js";

const jobSearchController = async (req, res) => {
    console.log("🔍 Job Search Controller Invoked");

    try {
        const { query, email } = req.body;
        if (!email || !query) {
            return res.status(400).json({ error: "Query and email are required" });
        }

        const { intent, parameters } = detectSimpleIntent(query);
        console.log("🔍 Extracted Intent:", intent, "📌 Parameters:", parameters);

        if (intent === "SHOW_JOBS") {
            const result = await fetchJobsData(parameters);
            return res.json(result);
        }

        const intentPrompt = `
        Identify the user's intent from this query: "${query}". 
        Respond ONLY in JSON format: 
        {
            "intent": "SHOW_JOBS" or "SAVE_JOBS" or "UNKNOWN",
            "parameters": {
                "title": "Software Engineer",
                "location": "Bangalore",
                "platform": "Naukri",
                "minSalary": 1000000
            }
        }
        `;

        const intentResponse = await askGemini(intentPrompt);
        console.log("🔮 Raw Intent Response:", intentResponse)	;
        if (!intentResponse?.content) {
            console.error("❌ AI Response is empty or undefined.");
            return res.status(500).json({ error: "AI did not return a valid response" });
        }

        const jsonMatch = intentResponse.content.match(/\{[\s\S]*\}/);
        const extractedJSON = jsonMatch ? jsonMatch[0] : null;

        if (!extractedJSON) {
            console.error("❌ Failed to extract JSON from AI response.");
            return res.status(500).json({ error: "AI response parsing failed" });
        }

        let parsedIntent;
        try {
            parsedIntent = JSON.parse(extractedJSON);
        } catch (error) {
            console.error("❌ Error parsing Gemini response:", error);
            return res.status(500).json({ error: "Failed to parse AI response" });
        }

        const aiIntent = parsedIntent?.intent || "UNKNOWN";
        let aiParameters = parsedIntent?.parameters || {};

        if (aiParameters.minSalary) {
            aiParameters.minSalary = Number(aiParameters.minSalary);
        }

        if (aiIntent === "SHOW_JOBS") {
            const jobs = await fetchJobsData(aiParameters);
            return res.json({ jobs });
        }

        if (aiIntent === "SAVE_JOBS") {
            await saveJobs(email, aiParameters);
            return res.json({ message: "Jobs saved successfully!" });
        }

        return res.json({ message: "I couldn't understand your request. Please try again." });

    } catch (err) {
        console.error("❌ Job Search Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { jobSearchController };

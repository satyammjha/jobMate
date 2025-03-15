import { askGemini } from "../agents/geminiAgent.js";
import { toggleNotifyExpiringJobs } from "./notifyUser.js";
import { jobSearchController } from "../controllers/agentControllers/jobSearchController.js";

const geminiAgentController = async (req, res) => {
    console.log("🔹 Gemini Agent Invoked");

    try {
        const { query, email } = req.body;
        console.log("📩 Query:", query, "👤 User:", email);

        if (!query || !email) {
            return res.status(400).json({ error: "❌ Query and email are required" });
        }

        const intentPrompt = `
        Identify the user's intent from this query: "${query}". 
        Respond ONLY in JSON format:
        {
            "intent": "JOB_SEARCH" or "ENABLE_NOTIFICATIONS" or "DISABLE_NOTIFICATIONS" or "UNKNOWN"
        }
        `;

        const intentResponse = await askGemini(intentPrompt);
        console.log("🧠 Raw AI Response:", intentResponse);

        let extractedJSON = intentResponse?.content?.replace(/```json|```/g, "").trim();

        let parsedIntent;
        try {
            parsedIntent = JSON.parse(extractedJSON);
        } catch (error) {
            console.error("❌ Error parsing AI response:", error);
            return res.status(500).json({ error: "AI response parsing failed" });
        }

        const intent = parsedIntent?.intent || "UNKNOWN";
        console.log("✅ Detected Intent:", intent);

        if (intent === "JOB_SEARCH") {
            return jobSearchController(req, res); 
        }

        if (["ENABLE_NOTIFICATIONS", "DISABLE_NOTIFICATIONS"].includes(intent)) {
            const action = intent === "ENABLE_NOTIFICATIONS" ? "enable" : "disable";
            return toggleNotifyExpiringJobs({ email, action }, res);
        }

        return res.json({ message: "🤖 I couldn't understand your request. Please try again." });

    } catch (err) {
        console.error("❌ Gemini Agent Error:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
};

export { geminiAgentController };
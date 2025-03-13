import { spawn } from "child_process";

export const jobMatchingFunction = async (req, res) => {
    try {
        const { jobs, skills } = req.body;

        if (!jobs || !skills) {
            return res.status(400).json({ error: "Jobs and skills are required" });
        }

        console.log("🔍 Processing job matching...");
        
        // Spawn a Python process to handle TF-IDF
        const pythonProcess = spawn("python", ["utility/jobMatcher.py", JSON.stringify(jobs), JSON.stringify(skills)]);

        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on("close", () => {
            res.json({ matchedJobs: JSON.parse(result) });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

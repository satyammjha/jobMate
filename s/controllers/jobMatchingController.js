import { spawn } from "child_process";

export const jobMatchingFunction = async (req, res) => {
    try {
        const { jobs, skills } = req.body;

        console.log("📩 Received jobs:", jobs);
        console.log("📩 Received skills:", skills);

        if (!jobs || !skills) {
            return res.status(400).json({ error: "Jobs and skills are required" });
        }

        console.log("🔍 Processing job matching...");

        // Spawn the Python process
        const pythonProcess = spawn("python", ["utility/jobMatcher.py"]);

        // Send JSON data through stdin
        pythonProcess.stdin.write(JSON.stringify({ jobs, skills }));
        pythonProcess.stdin.end(); // Close stdin after writing

        let result = "";
        
        pythonProcess.stdout.on("data", (data) => {
            console.log("🐍 Python Output:", data.toString());
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`❌ Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            console.log(`✅ Python process exited with code ${code}`);
            try {
                const parsedResult = JSON.parse(result);
                res.json({ matchedJobs: parsedResult });
            } catch (error) {
                console.error("🚨 Failed to parse Python output:", result);
                res.status(500).json({ error: "Invalid response from job matching script" });
            }
        });

    } catch (error) {
        console.error("🚨 Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

import User from "../models/User.js";

const actionLimits = {
    resumeAnalysis: 10,
    coverLetter: 20,
    desc: 10
};

const creditController = async (req, res) => {
    try {
        const { email, action } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (action === "resumeAnalysis") {
            const now = new Date();

            if (!user.resumeUploadTimestamp) {
                user.resumeUploadTimestamp = now;
                user.resumeUploads = 0;
            } else {
                const timeSinceLastReset = now - new Date(user.resumeUploadTimestamp);
                const hoursPassed = timeSinceLastReset / (1000 * 60 * 60);

                if (hoursPassed >= 24) {
                    user.resumeUploads = 0;
                    user.resumeUploadTimestamp = now;
                }
            }

            if (user.resumeUploads >= 3) {
                return res.status(400).json({ message: "Resume analysis limit (3 per 24h) reached" });
            }

            if (user.aiCredits < actionLimits.resumeAnalysis) {
                return res.status(400).json({ message: "Insufficient credits" });
            }

            user.resumeUploads += 1;
            user.aiCredits -= actionLimits.resumeAnalysis;

            await user.save();

            return res.status(200).json({ message: "Resume analysis completed", data: user });
        }

        if (user.aiCredits < actionLimits[action]) {
            return res.status(400).json({ message: "Insufficient credits" });
        }

        user.aiCredits -= actionLimits[action];
        await user.save();

        res.status(200).json({ message: "Credits updated successfully", data: user });
        console.log("Credits updated successfully", user);

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
        console.log(err);
    }
};

export default creditController;
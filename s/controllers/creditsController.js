import User from "../models/User.js";


const actionLimits = {
    resumeAnalysis: 10,
    coverLetter: 20,
    desc: 10
}


const creditController = async (req, res) => {
    try {
        const { email, action } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        else {
            if (user.aiCredits < actionLimits[action]) {
                res.status(400).json({ message: "Insufficient credits" });
                return;
            }

            const response = await User.findOneAndUpdate(
                { email: email },
                {
                    $inc: {
                        aiCredits: -actionLimits[action]
                    }
                },
                { new: true }
            );
            res.status(200).json({ message: "Credits updated successfully", data: response });
            console.log("Credits updated successfully", response);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
        console.log(err);
    }

}

export default creditController;
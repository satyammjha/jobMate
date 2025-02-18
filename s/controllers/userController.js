import User from "../models/User.js";
import generateReferralCode from "../utility/generateRefferalCode.js";
import { increaseReferralCount } from "../utility/increaserefferalCount.js";
import { updateCredits } from "../utility/updateCredits.js";

const addUserController = async (req, res) => {

    console.log("🔹 addUserController reached");

    try {
        const { email, name, referredBy } = req.body;
        console.log("🔹 req.body:", req.body);

        if (!email || !name) {
            return res.status(400).json({ message: "Name and email are required." });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        let referralCode;
        let isUnique = false;

        while (!isUnique) {
            referralCode = generateReferralCode();
            const existingCode = await User.findOne({ referralCode });
            if (!existingCode) isUnique = true;
        }

        let aiCredits = referredBy ? 50 : 100;
        let referredByUser = null;

        user = new User({ email, name, referralCode, aiCredits });

        if (referredBy) {
            referredByUser = await User.findOne({ referralCode: referredBy });

            if (referredByUser) {
                user.referredBy = referredByUser._id;
                referredByUser.referredUsers.push(user._id);

                await increaseReferralCount(referredByUser._id);
                await updateCredits(referredByUser._id, 10);
            }
        }

        await user.save();
        res.status(201).json({ message: "✅ User created successfully.", user });

    } catch (error) {
        console.error("Error in addUserController:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



export default addUserController;
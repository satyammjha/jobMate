import User from "../models/User.js";

export const increaseReferralCount = async (referrerId) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            referrerId,
            { $inc: { referralCount: 1 } },
            { new: true }
        );
        console.log("Referral count updated:", updatedUser);
    } catch (error) {
        console.error("Error updating referral count:", error);
    }
};
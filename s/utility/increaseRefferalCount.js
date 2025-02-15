import User from "../models/User.js";
/**
 * @param {string} referrerId
 */

export const increaseReferralCount = async (referrerId) => {
    try {
        await User.findByIdAndUpdate(referrerId, { $inc: { referralCount: 1 } });
    } catch (error) {
        console.error("Error updating referral count:", error);
    }
};
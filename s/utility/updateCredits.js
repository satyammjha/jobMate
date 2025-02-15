import User from "../models/User.js";

/**
 * Updates AI credits for a user
 * @param {string} userId - The ID of the user
 * @param {number} credits - Amount of AI credits to add
 */
export const updateCredits = async (userId, credits) => {
    try {
        await User.findByIdAndUpdate(userId, { $inc: { aiCredits: credits } });
    } catch (error) {
        console.error("Error updating AI credits:", error);
    }
};
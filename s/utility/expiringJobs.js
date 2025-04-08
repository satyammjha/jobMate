import User from "../models/User.js";

export const checkExpiringJobs = async (email) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const oneDayAgo = new Date();
    oneDayAgo.setDate(today.getDate() - 1); 

    try {
        const user = await User.findOne({ email }).select("savedJobs notifyAboutExpiringJobs");

        if (!user) {
            console.log(`User with email ${email} not found.`);
            return [];
        }

        if (!user.notifyAboutExpiringJobs) {
            console.log(`User ${email} has notifications disabled.`);
            return [];
        }

        const expiringJobs = user.savedJobs.filter(job => {
            if (!job.savedDate) return false;

            const savedDate = new Date(job.savedDate);
            savedDate.setHours(0, 0, 0, 0); 

            console.log(`Checking savedDate: ${savedDate}, One day ago: ${oneDayAgo}`);

            return savedDate < oneDayAgo; 
        });

        return expiringJobs;
    } catch (error) {
        console.error("Error fetching expiring jobs:", error);
        return [];
    }
};
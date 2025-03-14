import axios from "axios";

const API_URL = "http://localhost:5000";

export const matchJobs = async (skills, jobs) => {
    console.log("skills", skills, "jobs", jobs);
    try {
        const response = await axios.post(`${API_URL}/match`, {
            skills,
            jobs
        });
        return response.data;
    } catch (error) {
        console.error("Error matching jobs:", error?.response?.data || error.message);
        throw new Error("Failed to match jobs. Please try again later.");
    }
};
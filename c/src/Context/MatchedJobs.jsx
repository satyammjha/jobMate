import React, { createContext, useState, useEffect, useContext } from "react";
import { matchJobs } from "../services/matchJobs";
import { SkillsContext } from "../Context/SkillsContext";
import { useJobData } from "../Context/jobDataProvider";
export const MatchedJobsContext = createContext();

const MatchedJobsContextProvider = ({ children }) => {
    const [matchedJobs, setMatchedJobs] = useState([]);
    const { globalSkills } = useContext(SkillsContext);
    const { jobs } = useJobData();
    console.log("🛠 MatchedJobsContextProvider initialized...")
    console.log("🔹 Global Skills:", globalSkills)
    console.log("🔹 Jobs:", jobs)
    useEffect(() => {
        console.log("🛠 Running job match effect...");
        console.log("🔹 Skills:", globalSkills);
        console.log("🔹 Jobs:", jobs);

        if (!globalSkills?.length || !jobs?.length) {
            console.warn("🚫 Skipping API call: No skills or jobs.");
            return;
        }

        const match = async () => {
            try {
                const bestJobs = await matchJobs(globalSkills, jobs);
                console.log("✅ Best matched jobs:", bestJobs);
                setMatchedJobs(bestJobs);
            } catch (error) {
                console.error("❌ Error fetching matched jobs:", error);
            }
        };

        match();
    }, [globalSkills, jobs]);

    return (
        <MatchedJobsContext.Provider value={{ matchedJobs }}>
            {children}
        </MatchedJobsContext.Provider>
    );
};

export default MatchedJobsContextProvider;
"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import axios from "axios";

export default function InfiniteMovingCardsDemo() {
    const [jobsData, setJobsData] = useState({});
    const [mergedJobsData, setMergedJobsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/data/fetchJobsData");
                setJobsData(response.data);
                const mergedJobs = [...response.data.naukriJobs, ...response.data.gdJobs];

                setMergedJobsData(mergedJobs);
                console.log("Jobs fetched:", mergedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="w-screen overflow-hidden flex items-center justify-center">
            {loading ? (
                <p className="text-lg text-gray-600">Loading jobs...</p>
            ) : (
                <div className="h-full w-full">
                    <InfiniteMovingCards
                        jobs={mergedJobsData.length ? mergedJobsData : items}
                        direction="left"
                        speed="slow"
                        pauseOnHover={true}
                    />
                </div>
            )}
        </div>
    );
}

const items = [
    {
        jobId: "220125017236",
        title: "Associate (Supply / Field Sales)",
        link: "https://www.naukri.com/job-listings-associate-supply-field-sales-stanza-living-stanza-living-pune-mumbai-all-areas-2-to-7-years-220125017236",
        logo: "https://img.naukimg.com/logo_images/groups/v1/3394708.gif",
        company: "Stanza Living",
        experience: "2-7 Yrs",
        salary: "8-10 Lacs PA",
        location: "Pune, Mumbai (All Areas)",
        description: "Bachelors degree in Business, Real Estate, Finance, or a related field2+ years of exper relate",
        tags: [
            "Property Acquisition",
            "Franchisee Development",
            "Lead Generation",
            "Supply Chain",
            "Site Acquisition"
        ],
        posted: "4 Days Ago"
    },
];

"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import axios from "axios";

export default function InfiniteMovingCardsDemo() {
    const [jobsData, setJobsData] = useState({});
    useEffect(() => {

        const fetchJobs = async () => {
            const response = await axios.get("http://localhost:5000/data/fetchJobsData");
            setJobsData(response.data);
            console.log("Jobs", response.data);
        }

        fetchJobs();
    }, []);


    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="h-full w-full">
                <InfiniteMovingCards
                    jobs={items}
                    direction="left"
                    speed="slow"
                    pauseOnHover={true}
                />
            </div>
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
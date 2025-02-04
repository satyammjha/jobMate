"use client";

import React from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import glassdoor from "../assets/glassdoor.jpg";

export default function InfiniteMovingCardsDemo() {
    return (
        <div className="rounded-md flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none" />
            <InfiniteMovingCards
                items={items}
                direction="left"
                speed="slow"
                className="text-black dark:text-white"
                pauseOnHover={true}
            />
        </div>
    );
}

const items = [
    {
        companyLogo: glassdoor,
        position: "Software Engineer",
        companyName: "T",
        platformLogo: glassdoor,
        salaryRange: "$80,000 - $100,000/year",
        skills: ["JavaScript", "React", "Node.js", "CSS"],
        applyLink: "https://example.com/apply",
    },
];
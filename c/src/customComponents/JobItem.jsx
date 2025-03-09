import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const getProgressColor = (percentage) => {
    if (percentage > 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-red-500";
};

const getJobSource = (link) => {
    if (link.includes("glassdoor")) return "Glassdoor";
    if (link.includes("naukri")) return "Naukri";
    if (link.includes("linkedin")) return "LinkedIn";
    if (link.includes("indeed")) return "Indeed";
    return "Job Board";
};

const JobItem = ({
    company,
    logo,
    title,
    location,
    platformLogo,
    postedTime,
    matchedPercentage,
    salary,
    experienceLevel,
    jobType,
    remoteOption,
    link,
    jobDescription,
    requiredSkills,
    onClick,
}) => {
    const jobSource = getJobSource(link);

    return (
        <Card
            className="relative flex flex-col p-4 border border-muted rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className="absolute top-4 right-4 flex items-center gap-2">
                {platformLogo && (
                    <Avatar
                        src={platformLogo}
                        alt="Platform Logo"
                        className="h-8 w-8 rounded-full border border-gray-300"
                    />
                )}
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    Posted on {jobSource}
                </span>
            </div>

            <div className="flex items-center space-x-4">
                <Avatar
                    src={logo || "https://images.pexels.com/photos/170809/pexels-photo-170809.jpeg"}
                    alt={company}
                    className="h-12 w-12 rounded-full border-2 border-gray-200"
                />
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{company}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                        🌍 {location}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <p className="font-semibold">Match: {matchedPercentage}%</p>
                    <span className="text-xs">
                        {matchedPercentage > 80
                            ? '💚 Great Match!'
                            : matchedPercentage > 50
                                ? '🟡 Good Match'
                                : '🔴 Low Match'}
                    </span>
                </div>
                <Progress
                    value={matchedPercentage}
                    max={100}
                    className={`mt-2 h-2 rounded-full bg-gray-200 ${getProgressColor(matchedPercentage)} transition-all ease-in-out duration-300`}
                />
            </div>
        </Card>
    );
};

export default JobItem;
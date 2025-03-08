import { React } from "react";
import JobDetails from "../customComponents/JobDetails";
import JobItem from "../customComponents/JobItem";
import { Card } from "../components/ui/card";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
    return (
        <>
            <Helmet>
                <title>Job Listings Dashboard | Zobly</title>
                <meta name="description" content="Explore job listings from multiple sources and find the best opportunities tailored for you." />
                <meta name="keywords" content="job listings, job search, career opportunities, job board, Zobly" />
                <meta name="author" content="Zobly" />
                <meta property="og:title" content="Job Listings Dashboard | Zobly" />
                <meta property="og:description" content="Explore job listings from multiple sources and find the best opportunities tailored for you." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.zobly.com/dashboard" />
                <meta property="og:image" content="https://www.zobly.com/assets/job-dashboard-banner.png" />
            </Helmet>
            <SignedIn>
                <div className="flex h-[88vh] bg-background p-1">
                    <Card className="w-1/3 p-4 overflow-auto border-none hide-scrollbar cursor-pointer :hover:bg-[black]">
                        <div className="space-y-6">
                            {jobData.map((job, index) => (
                                <JobItem key={index} {...job} />
                            ))}
                        </div>
                    </Card>


                    <div className="w-[2px] bg-muted mx-2"></div>
                    <Card className="flex-1 p-6 border-none ">
                        <h2 className="text-xl font-bold mb-4">Job Details</h2>
                        <JobDetails />
                    </Card>
                </div>
            </SignedIn>

            <SignedOut>

                <h1>SignInToSeeDashboard</h1>

            </SignedOut>
        </>
    );
};

export default Dashboard;

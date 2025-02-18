import React, { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Upload, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const InfiniteMovingCardsDemo = lazy(() => import("../customComponents/HeroJob"));
const WorkflowTimeline = lazy(() => import("../customComponents/TimelineDemo"));
// const FileUploadDemo = lazy(() => import("../customComponents/FileUpload"));
const FeaturesSection = lazy(() => import("../customComponents/Features"));
const JobPlatformsCarousel = lazy(() => import("../customComponents/JobPlatforms"));
const Waitlist = lazy(() => import("../customComponents/Waitlist"));

const SkeletonLoader = () => (
    <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-12 w-full mt-4" />
    </div>
);

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const refCode = params.get("ref");

        if (refCode) {
            localStorage.setItem("referral", refCode);
        }
    }, [location]);

    return (
        <>
            <div className="relative min-h-screen w-full bg-white dark:bg-black bg-grid-black/[1] dark:bg-grid-white/[1]">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:to-gray-900 opacity-80"></div>
                <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        Apply {" "}
                        <span className="italic font-bold text-green-600 dark:text-green-400">Smarter</span>, Not {" "}
                        <span className="italic font-bold text-gray-500 dark:text-gray-400">Harder</span>
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                        Let AI match your resume to the best jobs and generate personalized
                        cover letters in seconds.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button className="px-6 py-4 text-lg flex items-center gap-2">
                            <Upload className="w-5 h-5" /> Upload Resume
                        </Button>
                        <Button variant="outline" className="px-6 text-lg flex items-center gap-2 border-2 hover:border-primary hover:bg-accent/10">
                            <Rocket className="w-5 h-5 animate-pulse" /> How It Works
                        </Button>
                    </div>
                </div>

                <Suspense fallback={<SkeletonLoader />}>
                    <InfiniteMovingCardsDemo />
                </Suspense>
            </div>

            <div className="relative z-10 mt-20">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl lg:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-8">
                    Powerful Features
                </motion.h2>
                <Suspense fallback={<SkeletonLoader />}>
                    <FeaturesSection />
                </Suspense>
            </div>

            <Suspense fallback={<SkeletonLoader />}>
                <JobPlatformsCarousel />
            </Suspense>

            <Suspense fallback={<SkeletonLoader />}>
                <WorkflowTimeline />
            </Suspense>
            {/* <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-8 mt-20">
                <Suspense fallback={<SkeletonLoader />}>
                    <FileUploadDemo />
                </Suspense>
            </div> */}
            <div className="relative z-10 mt-20 py-20">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl lg:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-8">
                    Latest Insights
                </motion.h2>
                <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
                    Discover valuable career tips and industry trends from our experts
                </p>
             
            </div>

            <Suspense fallback={<SkeletonLoader />}>
                <Waitlist />
            </Suspense>
        </>
    );
};

export default Home;
import React from "react";
import { cn } from "../lib/utils";
import { useJobData } from "../Context/jobDataProvider";
import { Bookmark, ArrowRight } from "lucide-react";
import { useSavedJobs } from "../Context/SavedJobContext";
import { Toaster } from "../components/ui/sonner";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

const BentoGrid = ({ className, children }) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[auto] grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoGridItem = ({ jobs, className }) => {
    const { saveJob, savedJobs } = useSavedJobs();
    <Toaster position="bottom-left" />
    const handleSaveJob = (job) => {
        const jobToSave = {
            jobId: job.jobId || job._id,
            title: job.title,
            company: job.company,
            location: job.location || "Not Specified",
            salary: job.salary || "Not Disclosed",
            experience: job.experience || "Not Mentioned",
            link: job.link,
            logo: job.logo || "",
        };

        saveJob(jobToSave);
        toast.success(`Saved ${job.title} to bookmarks`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "row-span-1 rounded-2xl group/bento hover:-translate-y-1 transition-all duration-300 p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 justify-between flex flex-col space-y-4 shadow-sm hover:shadow-md dark:hover:shadow-slate-800/20",
                className
            )}
        >
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 flex items-center justify-center p-2">
                        <img
                            src={jobs.logo}
                            alt={jobs.company}
                            className="w-8 h-8 object-contain rounded-lg"
                            loading="lazy"
                        />
                    </div>
                    <Button
                        onClick={() => handleSaveJob(jobs)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Save job"
                    >
                        <Bookmark
                            className={`w-5 h-5 transition-colors ${savedJobs.some((s) => s.jobId === jobs.jobId)
                                    ? "text-blue-500 fill-current"
                                    : "text-gray-400 dark:text-slate-500 hover:text-blue-400"
                                }`}
                        />
                    </Button>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-snug">
                        {jobs.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {jobs.company}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                    {[jobs.location, jobs.experience, jobs.salary].map(
                        (item, index) =>
                            item && (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-300"
                                >
                                    {item}
                                </span>
                            )
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(jobs.link, "_blank")}
                    className="w-full mt-1 flex items-center justify-between px-4 py-3 bg-gradient-to-r bg-black text-white rounded-xl transition-all"
                >
                    <span className="font-medium">Apply Now</span>
                    <ArrowRight className="w-4 h-4 transform group-hover/bento:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export function JobsGridDemo() {
    const { jobs } = useJobData();

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const randomJobs = React.useMemo(() => {
        const shuffled = shuffleArray(jobs);
        return shuffled.slice(0, 18);
    }, [jobs]);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10 p-10">
                <BentoGrid>
                    {randomJobs.map((job, i) => (
                        <BentoGridItem
                            key={`${job.jobId}-${i}`}
                            jobs={job}
                            className={(i === 2 || i === 7) ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

export const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[200px] rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-slate-800 dark:to-slate-900 animate-pulse overflow-hidden">
        <div className="w-full p-5 space-y-4">
            <div className="flex justify-between">
                <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-slate-700" />
                <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-slate-700" />
            </div>
            <div className="space-y-2">
                <div className="h-5 w-3/4 rounded-lg bg-neutral-200 dark:bg-slate-700" />
                <div className="h-4 w-1/2 rounded-lg bg-neutral-200 dark:bg-slate-700" />
            </div>
            <div className="flex gap-2">
                <div className="h-6 w-20 rounded-lg bg-neutral-200 dark:bg-slate-700" />
                <div className="h-6 w-20 rounded-lg bg-neutral-200 dark:bg-slate-700" />
            </div>
            <div className="h-12 w-full rounded-xl bg-neutral-200 dark:bg-slate-700" />
        </div>
    </div>
);
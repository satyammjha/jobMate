import React from "react";
import { cn } from "../lib/utils";
import { useJobData } from "../Context/jobDataProvider";
import { Bookmark, ArrowRight, MapPin, Briefcase, Banknote, Globe } from "lucide-react";
import { useSavedJobs } from "../Context/SavedJobContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Helmet } from "react-helmet-async";
import { Input } from "../components/ui/input";

const BentoGrid = ({ className, children }) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoGridItem = ({ job, className }) => {
    const { saveJob, savedJobs } = useSavedJobs();
    const [isHovered, setIsHovered] = React.useState(false);

    const handleSaveJob = (job) => {
        const jobToSave = {
            jobId: job.jobId || job._id,
            title: job.title,
            company: job.company,
            location: job.location || "Remote",
            salary: job.salary || "Competitive Salary",
            experience: job.experience || "Flexible",
            type: job.type || "Full-time",
            posted: job.posted || "Recently",
            link: job.link,
            tags: job.tags || [],
            savedDate: new Date().toISOString(),
            logo: job.logo || "",
        };

        saveJob(jobToSave);
        toast.success(`${job.title} saved to your bookmarks`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            className={cn(
                "group/bento relative h-full rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden",
                className
            )}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            itemScope
            itemType="https://schema.org/JobPosting"
        >
            <Helmet>
                <title>{`${job.title} at ${job.company} | Career Opportunities`}</title>
                <meta name="description" content={`Apply for ${job.title} position at ${job.company}. ${job.location} - ${job.experience} experience - ${job.salary}`} />
                <meta property="og:title" content={`${job.title} at ${job.company}`} />
                <meta property="og:description" content={`Career opportunity: ${job.title} at ${job.company}`} />
            </Helmet>

            <div className="flex flex-col h-full p-6 justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 max-w-[80%]">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 flex items-center justify-center p-1 shrink-0">
                                <img
                                    src={job.logo}
                                    alt={job.company}
                                    className="w-10 h-10 object-contain rounded-md"
                                    loading="lazy"
                                    itemProp="image"
                                />
                            </div>
                            <div className="space-y-1 truncate">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate" itemProp="title">
                                    {job.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate" itemProp="hiringOrganization">
                                    {job.company}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleSaveJob(job)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
                            aria-label={`Save ${job.title} position`}
                        >
                            <Bookmark
                                className={`w-5 h-5 transition-colors ${savedJobs.some((s) => s.jobId === job.jobId)
                                    ? "text-blue-500 fill-current"
                                    : "text-gray-400 dark:text-slate-500 hover:text-blue-400"
                                    }`}
                            />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-slate-800 rounded-full text-sm text-blue-600 dark:text-blue-300 max-w-full">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate" itemProp="jobLocation">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-slate-800 rounded-full text-sm text-purple-600 dark:text-purple-300 max-w-full">
                            <Briefcase className="w-4 h-4 shrink-0" />
                            <span className="truncate" itemProp="employmentType">{job.type}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-slate-800 rounded-full text-sm text-green-600 dark:text-green-300 max-w-full">
                                <Banknote className="w-4 h-4 shrink-0" />
                                <span className="truncate" itemProp="baseSalary">{job.salary}</span>
                            </div>
                        )}
                    </div>

                    {job.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {job.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-gray-50 dark:bg-slate-800 rounded-md text-gray-600 dark:text-gray-300 truncate"
                                    itemProp="skills"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <motion.div
                    className="mt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        asChild
                        className="w-full group/apply h-12 rounded-lg bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white"
                    >
                        <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            itemProp="url"
                            aria-label={`Apply for ${job.title} at ${job.company}`}
                        >
                            <span className="flex items-center gap-2">
                                Apply Now
                                <ArrowRight className="w-4 h-4 transform group-hover/apply:translate-x-1 transition-transform" />
                            </span>
                        </a>
                    </Button>

                </motion.div>
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 dark:via-slate-900/20 dark:to-slate-900/40 rounded-xl pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export function JobsGrid() {
    const { jobs } = useJobData();
    const [selectedFilter, setSelectedFilter] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredJobs = React.useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = selectedFilter === "all" || job.type === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [jobs, searchQuery, selectedFilter]);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <Input
                        placeholder="Search roles or companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {filteredJobs.length > 0 ? (
                    <BentoGrid>
                        {filteredJobs.slice(0, 12).map((job, i) => (
                            <BentoGridItem
                                key={`${job.jobId}-${i}`}
                                job={job}
                                className={i % 5 === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                            />
                        ))}
                    </BentoGrid>
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Globe className="mx-auto h-12 w-12 mb-4" />
                        <p>No positions found matching your criteria</p>
                    </div>
                )}
            </div>
            <Toaster position="bottom-left" />
        </section>
    );
}

export const JobGridSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="h-full rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 animate-pulse overflow-hidden"
                >
                    <div className="h-full p-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-3 w-[80%]">
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-800 shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-800 rounded" />
                                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800 rounded" />
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded" />
                                <div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                        <div className="h-12 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};
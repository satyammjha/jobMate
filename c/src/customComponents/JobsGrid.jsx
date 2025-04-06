import React, { useContext } from "react";
import { cn } from "../lib/utils";
import { useJobData } from "../Context/jobDataProvider";
import { Bookmark, ArrowRight, MapPin, Briefcase, Banknote, Globe, LogIn, Building2 } from "lucide-react";
import { useSavedJobs } from "../Context/SavedJobContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Input } from "../components/ui/input";
import { MatchedJobsContext } from "../Context/MatchedJobs";
import useUserData from "../Context/UserContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";

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
            company: job.company || "N/A",
            location: job.location || "N/A",
            salary: job.salary || "N/A",
            experience: job.experience || "N/A",
            type: job.type || "N/A",
            posted: job.posted || "N/A",
            link: job.link || "#",
            tags: job.tags || [],
            savedDate: new Date().toISOString(),
            logo: job.logo || "",
        };

        saveJob(jobToSave);
        toast.success(`${job.title || 'Job'} saved to your bookmarks`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
                "group/bento relative h-full rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden",
                "hover:border-gray-300 dark:hover:border-slate-600",
                className
            )}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            itemScope
            itemType="https://schema.org/JobPosting"
        >
            <div className="flex flex-col h-full p-6 justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 max-w-[80%]">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 flex items-center justify-center p-1 shrink-0">
                                {job.logo ? (
                                    <img
                                        src={job.logo}
                                        alt={job.company}
                                        className="w-10 h-10 object-contain rounded-md"
                                        loading="lazy"
                                        itemProp="image"
                                    />
                                ) : (
                                    <Building2 className="w-6 h-6 text-gray-400 dark:text-slate-500" />
                                )}
                            </div>
                            <div className="space-y-1 truncate">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate" itemProp="title">
                                    {job.title || "N/A"}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate" itemProp="hiringOrganization">
                                    {job.company || "N/A"}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleSaveJob(job)}
                            variant="ghost"
                            size="sm"
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
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-300 rounded-full text-sm transition-colors">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate" itemProp="jobLocation">{job.location || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-slate-800/50 text-purple-600 dark:text-purple-300 rounded-full text-sm transition-colors">
                            <Briefcase className="w-4 h-4 shrink-0" />
                            <span className="truncate" itemProp="employmentType">{job.type || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-slate-800/50 text-green-600 dark:text-green-300 rounded-full text-sm transition-colors">
                            <Banknote className="w-4 h-4 shrink-0" />
                            <span className="truncate" itemProp="baseSalary">{job.salary || "N/A"}</span>
                        </div>
                    </div>

                    {job.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {job.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-gray-50 dark:bg-slate-800/50 rounded-md text-gray-600 dark:text-gray-300 truncate transition-colors"
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
                        className="w-full group/apply h-12 rounded-lg bg-gradient-to-r from-black to-gray-900 hover:from-gray-800 hover:to-gray-900 text-white 
                                  dark:from-white dark:to-gray-200 dark:text-slate-900 dark:hover:from-gray-200 dark:hover:to-gray-300 shadow-md"
                    >
                        <a
                            href={job.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            itemProp="url"
                            aria-label={`Apply for ${job.title} at ${job.company}`}
                            className="flex items-center justify-center gap-2"
                        >
                            <span className="font-medium">Apply Now</span>
                            <ArrowRight className="w-4 h-4 transform group-hover/apply:translate-x-1 transition-transform" />
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
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 dark:via-slate-900/10 dark:to-slate-900/20 rounded-xl pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export function JobsGrid() {
    const { jobs } = useJobData();
    const [searchQuery, setSearchQuery] = React.useState("");
    const { userData } = useUserData();
    const { matchedJobs } = useContext(MatchedJobsContext);

    const filteredJobs = React.useMemo(() => {
        return jobs.filter(job => {
            const searchLower = searchQuery.toLowerCase();
            return (
                job.title?.toLowerCase().includes(searchLower) ||
                job.company?.toLowerCase().includes(searchLower) ||
                job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        });
    }, [jobs, searchQuery]);

    const filteredMatchedJobs = React.useMemo(() => {
        if (!matchedJobs?.matchedJobs?.length) return [];
        return matchedJobs.matchedJobs.filter(job => {
            const searchLower = searchQuery.toLowerCase();
            return (
                job.title?.toLowerCase().includes(searchLower) ||
                job.company?.toLowerCase().includes(searchLower) ||
                job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        });
    }, [matchedJobs, searchQuery]);

    const renderNoJobsFound = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
            <Globe className="mx-auto h-12 w-12 mb-4 text-gray-400 dark:text-slate-600" />
            <p className="text-lg">No positions found matching your criteria</p>
            <p className="text-sm mt-2 text-gray-400 dark:text-slate-500">
                Try adjusting your search filters
            </p>
        </motion.div>
    );

    const renderLoginPrompt = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <LogIn className="h-8 w-8 text-gray-600 dark:text-slate-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
                Sign in to view your personalized job matches
            </p>
            <Button asChild variant="outline" className="gap-2">
                <a href="/login">
                    <LogIn className="w-4 h-4" />
                    Login to Continue
                </a>
            </Button>
        </motion.div>
    );

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <Input
                        placeholder="Search roles, companies, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-xl h-12 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                </div>

                <Tabs defaultValue="all" className="w-full space-y-8">
                    <TabsList className="w-full md:w-auto bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 px-6 py-2 rounded-md"
                        >
                            All Jobs
                        </TabsTrigger>
                        <TabsTrigger
                            value="matched"
                            disabled={!userData?.email}
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Matched Jobs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
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
                            renderNoJobsFound()
                        )}
                    </TabsContent>

                    <TabsContent value="matched" className="space-y-4">
                        {userData?.email ? (
                            filteredMatchedJobs.length > 0 ? (
                                <BentoGrid>
                                    {filteredMatchedJobs.slice(0, 12).map((job, i) => (
                                        <BentoGridItem
                                            key={`matched-${job.jobId}-${i}`}
                                            job={job}
                                            className={i % 5 === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                                        />
                                    ))}
                                </BentoGrid>
                            ) : (
                                renderNoJobsFound()
                            )
                        ) : (
                            renderLoginPrompt()
                        )}
                    </TabsContent>
                </Tabs>
            </div>
            <Toaster position="bottom-left" theme="system" />
        </section>
    );
}

export const JobGridSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="h-full rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                    <div className="h-full p-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-3 w-[80%]">
                                    <Skeleton className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-800" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-slate-800" />
                                        <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800" />
                                    </div>
                                </div>
                                <Skeleton className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                                <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                                <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-full" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded" />
                                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                        <Skeleton className="h-12 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};
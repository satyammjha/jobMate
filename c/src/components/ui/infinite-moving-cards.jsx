import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ArrowRight, Bookmark } from "lucide-react";
import { toast } from "react-hot-toast";
import glassdoor from "../../assets/glassdoor.jpg";

export const InfiniteMovingCards = ({
  jobs,
  direction,
  speed,
  pauseOnHover,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    const durations = {
      fast: "20s",
      normal: "40s",
      slow: "120s",
    };
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-duration",
        durations[speed]
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]",
        "dark:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
        className
      )}
    >
      <style>
        {`
          @keyframes scroll {
            to {
              transform: translate(calc(-50% - 1rem));
            }
          }
          .animate-scroll {
            animation: scroll var(--animation-duration, 40s) linear infinite;
            animation-direction: var(--animation-direction, forwards);
          }
          .animate-scroll:hover {
            animation-play-state: var(--animation-play-state);
          }
        `}
      </style>

      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {jobs.map((job, idx) => (
          <li
            className="relative rounded-2xl border flex-shrink-0 
                  border-gray-100 dark:border-slate-800 px-8 py-6 
                  bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl
                  dark:shadow-slate-950/50 transition-all duration-300
                  hover:-translate-y-2 group flex flex-col"
            key={`${job.jobId}-${idx}`}
          >
            <blockquote className="flex flex-col flex-1 gap-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-10 h-10 object-contain"
                      aria-label={`${job.company} logo`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.company}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => toast.success(`Job ${job.title} saved!`)}
                  aria-label="Save job"
                >
                  <Bookmark className="w-5 h-5 text-gray-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">📍</span>
                  <span className="text-gray-700 dark:text-slate-300">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">💼</span>
                  <span className="text-gray-700 dark:text-slate-300">
                    {job.experience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">💰</span>
                  <span className="text-gray-700 dark:text-slate-300">
                    {job.salary}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">⏳</span>
                  <span className="text-gray-700 dark:text-slate-300">
                    {job.posted}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {job.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <Button
                  className="bg-black hover:bg-gray-900 text-white 
                      transition-colors duration-300 flex items-center gap-2 
                      justify-center py-2 px-4 text-md shadow-lg hover:shadow-blue-500/20
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => window.open(job.link, "_blank")}
                  aria-label="Apply now"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Posted on:
                  </span>
                  <img
                    src={glassdoor}
                    alt="Glassdoor"
                    className="w-20 h-15"
                    aria-label="Glassdoor"
                  />
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
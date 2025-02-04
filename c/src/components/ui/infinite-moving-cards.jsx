import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
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
      slow: "80s",
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
        "scroller relative z-20 max-w-7xl overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        "dark:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <style>
        {`
          @keyframes scroll {
            to {
              transform: translate(calc(-50% - 0.5rem));
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
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 
                     border-gray-200 dark:border-slate-700 px-8 py-6 md:w-[450px]
                     bg-white dark:bg-black shadow-lg dark:shadow-neutral-800/50"
            key={`${item.companyName}-${idx}`}
          >
            <blockquote className="flex flex-col gap-4">
              {/* Company Logo and Position */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={item.companyLogo}
                    alt={`${item.companyName} logo`}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                    {item.position} at {item.companyName}
                  </span>
                </div>
                {/* Platform Logo */}
                <img
                  src={item.platformLogo}
                  alt={`${item.platform} logo`}
                  className="w-8 h-8 object-contain"
                />
              </div>

              {/* Salary Range */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Salary Range:</strong> {item.salaryRange}
              </div>

              {/* Required Skills */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Required Skills:</strong> {item.skills.join(", ")}
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  className="px-4 py-2 text-white rounded-lg"
                  onClick={() => window.open(item.applyLink, "_blank")}
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Button>
                <button
                  className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400"
                  onClick={() => alert("Job saved")}
                >
                  Save Job
                </button>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

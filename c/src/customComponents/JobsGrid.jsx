import React from "react";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import {
    IconArrowWaveRightUp,
    IconBoxAlignRightFilled,
    IconBoxAlignTopLeft,
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";
import { useJobData } from "../Context/jobDataProvider";

export function JobsGridDemo() {
    const { jobs, error, isLoading } = useJobData();
    console.log("jobdata",jobs);
    return (
        (<BentoGrid className="max-w-4xl mx-auto">
            {jobs.map((item, i) => (
                <BentoGridItem
                    key={i}
                    jobs={item}
                    className={i === 3 || i === 6 ? "md:col-span-2" : ""} />
            ))}
        </BentoGrid>)
    );
}
const Skeleton = () => (
    <div
        className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
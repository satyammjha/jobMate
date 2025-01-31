import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useId } from "react";
import { Briefcase, Globe, Users, Code, Shield, Monitor, Network, Cloud, Database } from 'lucide-react';

const platforms = [
    { name: "Indeed", logo: <Briefcase size={40} /> },
    { name: "AngelList", logo: <Globe size={40} /> },
    { name: "Glassdoor", logo: <Users size={40} /> },
    { name: "Monster", logo: <Shield size={40} /> },
    { name: "Dice", logo: <Monitor size={40} /> },
    { name: "We Work Remotely", logo: <Network size={40} /> },
    { name: "Remote.co", logo: <Cloud size={40} /> },
    { name: "Stack Overflow", logo: <Code size={40} /> },
    { name: "GitHub", logo: <Database size={40} /> },
];

export function JobPlatformsCarousel() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                        Jobs from Top Platforms
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Discover opportunities from the world's leading job platforms
                    </p>
                </motion.div>

                <div className="relative h-[500px] w-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <Carousel
                            direction="right"
                            platforms={platforms.slice(0, 5)}
                            speed={40}
                            offset="0%"
                        />
                    </div>

                    <div className="absolute top-1/2 left-0 w-full h-full">
                        <Carousel
                            direction="left"
                            platforms={platforms.slice(5)}
                            speed={45}
                            offset="-50%"
                        />
                    </div>

                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-20" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-20" />
                </div>
            </div>
        </section>
    );
}

function Carousel({ direction, platforms, speed, offset }) {
    const id = useId();

    return (
        <motion.div
            key={`${id}-${direction}`}
            initial={{ x: direction === "left" ? "100%" : "-100%" }}
            animate={{ x: direction === "left" ? "-100%" : "100%" }}
            transition={{
                duration: speed,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{ x: offset }}
            className="flex gap-8 items-center"
        >
            {[...platforms, ...platforms].map((platform, index) => (
                <motion.div
                    key={`${platform.name}-${direction}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0"
                >
                    <Card className="w-60 h-60 p-6 bg-white/20 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center h-full p-4">
                            <motion.div
                                className="w-20 h-20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-900/50 rounded-2xl p-4"
                                whileHover={{ rotate: 15, scale: 1.1 }}
                            >
                                {platform.logo}
                            </motion.div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                                {platform.name}
                            </h3>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
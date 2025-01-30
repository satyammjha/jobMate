"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GlobeIcon, RocketIcon, SparklesIcon, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8 text-purple-500" />,
      title: "AI-Powered Matching",
      description: "Smart algorithms analyze your resume and match with ideal jobs"
    },
    {
      icon: <RocketIcon className="w-8 h-8 text-blue-500" />,
      title: "Instant Applications",
      description: "One-click apply with auto-generated cover letters"
    },
    {
      icon: <LockIcon className="w-8 h-8 text-green-500" />,
      title: "Secure & Private",
      description: "Military-grade encryption for your personal data"
    },
    {
      icon: <GlobeIcon className="w-8 h-8 text-orange-500" />,
      title: "Global Opportunities",
      description: "Access jobs from 50+ countries worldwide"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-[500px] w-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute right-[10%] top-[50%] h-[500px] w-[500px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4 dark:text-white">
            Revolutionize Your Job Search
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Harness the power of AI to streamline your job application process and land
            your dream role faster than ever before.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full transition-all hover:shadow-lg hover:border-purple-500/20 dark:hover:border-purple-500/30",
                "dark:bg-gray-950 dark:border-gray-800"
              )}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Animated CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Join 10,000+ successful candidates
          </p>
          <button className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group">
            <span className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-105"></span>
            <span className="relative flex items-center gap-2">
              <RocketIcon className="w-5 h-5" />
              Start Free Trial
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
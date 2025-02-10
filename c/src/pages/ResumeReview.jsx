import React from 'react';
import { Button } from '../components/ui/button';
import { SparklesIcon, ScanSearchIcon } from 'lucide-react';
import UploadResume from '../customComponents/Resume/UploadResume';
import HandleJobDescription from '../customComponents/Resume/HandleJobDescription';

const ResumeReview = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-8 mt-14 dark:text-white">
            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            AI-Powered Resume Analysis <SparklesIcon />
                        </h1>
                        </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <ScanSearchIcon className="w-4 h-4" />
                            Get Analysis
                        </Button>
                        <Button className="bg-black gap-2">
                            <SparklesIcon className="w-4 h-4" />
                            See Jobs
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <UploadResume />
                    <HandleJobDescription />
                </div>
            </div>
        </div>
    );
};

export default ResumeReview;
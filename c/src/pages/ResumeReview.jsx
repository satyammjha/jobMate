import React from 'react';
import { Button } from '../components/ui/button';
import { SparklesIcon, ScanSearchIcon, RocketIcon } from 'lucide-react';
import UploadResume from '../customComponents/Resume/UploadResume';
import HandleJobDescription from '../customComponents/Resume/HandleJobDescription';

const ResumeReview = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-3 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
                            <SparklesIcon className="w-8 h-8 text-gray-800 dark:text-gray-300" />
                            Smart Resume Analysis
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            AI-powered insights to boost your job search success
                        </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button 
                            variant="outline" 
                            className="gap-2 px-6 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ScanSearchIcon className="w-5 h-5 text-gray-900 dark:text-gray-300" />
                            <span className="text-gray-900 dark:text-gray-200">Get Analysis</span>
                        </Button>
                        <Button 
                            className="gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white transition-all shadow-lg hover:shadow-xl"
                        >
                            <RocketIcon className="w-5 h-5" />
                            <span>Match Jobs</span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <UploadResume />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <HandleJobDescription />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeReview;
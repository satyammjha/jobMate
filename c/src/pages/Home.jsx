import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Navbar from '../customComponents/Navbar/Navbar';
import { CheckCircle, Upload, Rocket, Briefcase, Star, Users } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:to-gray-900">

            {/* Hero Section */}
            <div className="text-center py-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                    Apply <span className="italic font-bold text-green-600 dark:text-green-600">Smarter</span>, Not{' '}
                    <span className="italic font-bold text-gray-500 dark:text-gray-400">Harder</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                    Let AI match your resume to the best jobs and generate personalized cover letters in seconds.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Button className="px-8 py-4 text-lg flex items-center dark:bg-slate-50 gap-2 bg-black hover:bg-blue-700">
                        <Upload className="w-5 h-5" /> Upload Resume
                    </Button>
                    <Button variant="outline" className="px-8 py-4 text-lg flex items-center gap-2">
                        <Rocket className="w-5 h-5" /> How It Works
                    </Button>
                </div>
            </div>


        </div>
    );
};

export default Home;
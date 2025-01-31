import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { FileIcon, SparklesIcon, UploadIcon, ClipboardIcon, CrosshairIcon, CopyIcon, ScanSearchIcon } from 'lucide-react';

const ResumeReview = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdFile, setJdFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [gaps, setGaps] = useState([]);
    const [compatibilityScore, setCompatibilityScore] = useState(0);
    const [skillsData, setSkillsData] = useState([]);
    const [coverLetters, setCoverLetters] = useState([]);

    const handleResumeUpload = (e) => {
        if (e.target.files?.[0]) {
            setResumeFile(e.target.files[0]);
            setTimeout(() => {
                setKeywords(['React', 'TypeScript', 'Project Management', 'Agile', 'Node.js']);
                setSkillsData([
                    { name: 'React', resume: 8, jd: 0 },
                    { name: 'TypeScript', resume: 7, jd: 0 },
                    { name: 'Leadership', resume: 3, jd: 0 },
                ]);
            }, 1000);
        }
    };

    const handleJdUpload = (e) => {
        if (e.target.files?.[0]) {
            setJdFile(e.target.files[0]);
            setTimeout(() => {
                setSuggestions(['Add more leadership examples', 'Include CI/CD experience']);
                setGaps(['CI/CD', 'AWS', 'Team Leadership']);
                setCompatibilityScore(65);
                setSkillsData(prev => prev.map(skill => ({
                    ...skill,
                    jd: ['React', 'TypeScript', 'Leadership'].includes(skill.name) ? 6 : 0
                })));
            }, 1000);
        }
    };

    const handleJdTextChange = (e) => {
        setJdText(e.target.value);
        if (e.target.value) {
            setTimeout(() => {
                setSuggestions(['Add more leadership examples', 'Include CI/CD experience']);
                setGaps(['CI/CD', 'AWS', 'Team Leadership']);
                setCompatibilityScore(65);
                setSkillsData(prev => prev.map(skill => ({
                    ...skill,
                    jd: ['React', 'TypeScript', 'Leadership'].includes(skill.name) ? 6 : 0
                })));
            }, 1000);
        }
    };

    const handleGenerateCoverLetter = () => {
        setTimeout(() => {
            setCoverLetters([
                "Experienced React developer with 5+ years in agile environments...",
                "Dynamic professional with proven track record in Node.js and team leadership...",
                "Detail-oriented full-stack developer passionate about modern web technologies..."
            ]);
        }, 1000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-8 mt-14 dark:text-white">
            <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 ">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            <div>
                                AI-Powered Resume Analysis <SparklesIcon />
                            </div>
                        </h1>
                        <p className="text-slate-600 dark:text-white">Optimize your resume for any job description</p>
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

                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-blue-600">
                                    <FileIcon className="w-5 h-5" />
                                    Your Resume
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="relative group">
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors group-hover:border-blue-200">
                                        <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                        <p className="text-sm text-slate-600 mb-2">
                                            Drag & drop PDF/DOCX file or{" "}
                                            <span className="text-blue-600 cursor-pointer">browse files</span>
                                        </p>
                                        <Input
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={handleResumeUpload}
                                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {resumeFile && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <FileIcon className="w-4 h-4 text-slate-500" />
                                            <span className="font-medium text-slate-800">{resumeFile.name}</span>
                                            <span className="text-slate-500">{(resumeFile.size / 1024).toFixed(1)}KB</span>
                                        </div>
                                    </div>
                                )}

                                {keywords.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                            <CrosshairIcon className="w-4 h-4" />
                                            Detected Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {keywords.map((keyword, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {compatibilityScore > 0 && (
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-slate-800">Match Analysis</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="relative w-32 h-32">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                                <circle className="text-emerald-600" strokeWidth="8" strokeDasharray={`${compatibilityScore * 2.51} 251`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-emerald-600">
                                                    {compatibilityScore}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-800">Strengths</h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {keywords.slice(0, 3).map((keyword, index) => (
                                                        <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-800">Development Areas</h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {gaps.slice(0, 3).map((gap, index) => (
                                                        <span key={index} className="px-2 py-1 bg-rose-100 text-rose-800 rounded-full text-xs">
                                                            {gap}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-emerald-600">
                                    <ClipboardIcon className="w-5 h-5" />
                                    Job Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors group-hover:border-emerald-200">
                                            <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                            <p className="text-sm text-slate-600 mb-2">
                                                Upload Job Description or{" "}
                                                <span className="text-emerald-600 cursor-pointer">paste text</span>
                                            </p>
                                            <Input
                                                type="file"
                                                accept=".pdf,.docx"
                                                onChange={handleJdUpload}
                                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-200"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-2 bg-white text-sm text-slate-500">OR</span>
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Paste job description here..."
                                        value={jdText}
                                        onChange={handleJdTextChange}
                                        className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        onClick={handleGenerateCoverLetter}
                                        className="w-full bg-black gap-2"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        Generate Cover Letter
                                    </Button>

                                    {coverLetters.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-slate-800">Suggested Cover Letters</h3>
                                            {coverLetters.map((letter, index) => (
                                                <Card key={index} className="border border-slate-200 group hover:border-emerald-200 transition-colors">
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm text-slate-600 line-clamp-3 pr-4">
                                                                {letter}
                                                            </p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyToClipboard(letter)}
                                                                className="text-slate-500 hover:text-emerald-600"
                                                            >
                                                                <CopyIcon className="w-4 h-4 mr-2" />
                                                                Copy
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeReview;
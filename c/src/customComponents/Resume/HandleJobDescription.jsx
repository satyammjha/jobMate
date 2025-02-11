import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// import { CopyIcon, SparklesIcon, UploadIcon } from '../../components/ui/file-upload';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { JdContext } from '../../Context/JdContext';

const HandleJobDescription = () => {
    const [jdText, setJdText] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [gaps, setGaps] = useState([]);
    const [compatibilityScore, setCompatibilityScore] = useState(0);
    const [coverLetters, setCoverLetters] = useState([]);
    const { Jd, setJd } = useContext(JdContext);

    const handleJdUpload = (e) => {
        if (e.target.files?.[0]) {
            setJdFile(e.target.files[0]);
            setTimeout(() => {
                setSuggestions(['Add more leadership examples', 'Include CI/CD experience']);
                setGaps(['CI/CD', 'AWS', 'Team Leadership']);
                setCompatibilityScore(65);
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
            setJd(jdText);
            alert(Jd);
        }, 1000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-emerald-600">
                        Job Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors group-hover:border-emerald-200">
                                {/* <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" /> */}
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
                            {/* <SparklesIcon className="w-4 h-4" /> */}
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
                                                    {/* <CopyIcon className="w-4 h-4 mr-2" /> */}
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
        </>
    );
};

export default HandleJobDescription;
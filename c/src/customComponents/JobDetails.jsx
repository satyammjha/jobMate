import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel';
import { ArrowUpRight } from 'lucide-react';
import {Link} from "react-router-dom"
import CoverLetterButton from './CoverLetterButton';

const JobDetails = ({ job }) => {
    const [isResumeUploaded, setIsResumeUploaded] = useState(false);
    const [skillGap] = useState(['HTML', 'CSS']);
    const [uploadedSkills, setUploadedSkills] = useState([]);

    const handleResumeUpload = () => {
        setIsResumeUploaded(true);
        setUploadedSkills(['HTML', 'CSS', 'JavaScript']);
    };

    const missingSkills = skillGap.filter(skill => !uploadedSkills.includes(skill));

    if (!job) {
        return <p className="text-muted-foreground">No job selected.</p>;
    }

    return (
        <div className="max-h-full overflow-scroll hide-scrollbar p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="w-1/2">
                        <Progress value={job.matchedPercentage} className="h-3" />
                        <div className="flex justify-between mt-2">
                            <span className="text-sm text-muted-foreground">Compatibility</span>
                            <span className="font-semibold">{job.matchedPercentage}%</span>
                        </div>
                    </div>
                    {!isResumeUploaded && (
                        <Button onClick={handleResumeUpload} className="ml-4">
                            Upload Resume
                        </Button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{job.title}</h1>
                        <p className="text-lg text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link to={job.link} target="_blank" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto">Apply Now <ArrowUpRight /> </Button>
                        </Link>
                        {isResumeUploaded && (
                            <CoverLetterButton />
                        )}
                    </div>
                </div>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={job.logo} alt={job.company} />
                            <AvatarFallback>{job.company[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{job.company}</h3>
                            <div className="flex gap-2 mt-1">
                                <Badge variant="secondary">{job.location}</Badge>
                                <Badge variant="secondary">{job.salary}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row gap-6">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Job Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{job.jobDescription}</p>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Required Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills?.map((skill) => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {missingSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Development Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Carousel>
                                <CarouselContent>
                                    {missingSkills.map((skill, index) => (
                                        <CarouselItem key={index} className="p-4 md:basis-2/3 lg:basis-2/3">
                                            <Card>
                                                <CardContent className="p-4">
                                                    <h4 className="font-semibold mb-2">Resources for {skill}</h4>
                                                    <ul className="space-y-2 text-muted-foreground">
                                                        <li>📖 Article: Mastering {skill}</li>
                                                        <li>🎥 Video: Introduction to {skill}</li>
                                                        <li>🛤️ Roadmap: Learning {skill} step by step</li>
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
import { useState, useEffect, useContext } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Trash2, UploadCloud } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { SkillsContext } from "../../Context/SkillsContext";

function UploadResume() {
    const [currentPdf, setCurrentPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [processingSkills, setProcessingSkills] = useState(false);
    const [AIReview, setAIReview] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const { globalSkills, setGlobalSkills } = useContext(SkillsContext);

    const genAI = new GoogleGenerativeAI("AIzaSyAx4bapGjEdXuwlAgRwpK2jda5Cmklf5rw");

    useEffect(() => {
        const savedPdf = localStorage.getItem("currentPdf");
        if (savedPdf) {
            setCurrentPdf(JSON.parse(savedPdf));
        }
    }, []);

    useEffect(() => {
        if (currentPdf) {
            localStorage.setItem("currentPdf", JSON.stringify(currentPdf));
        }
    }, [currentPdf]);

    const extractText = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setProcessingSkills(true);
        setExtractedText('');
        setAIReview('');
        setGlobalSkills([]);

        const reader = new FileReader();
        reader.onload = async function () {
            try {
                const typedArray = new Uint8Array(reader.result);
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
                }
                setExtractedText(fullText);

                const newPdf = {
                    id: Date.now(),
                    name: file.name,
                    text: fullText || "No text found in the PDF",
                    date: new Date().toLocaleString(),
                };
                setCurrentPdf(newPdf);

                // Extract skills using AI
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const prompt = `Extract technical skills from this resume text as a comma-separated list (max 10 skills): ${fullText}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const skillsList = response.text().split(',').map(skill => skill.trim());

                setGlobalSkills(skillsList);
                localStorage.setItem("globalSkills", JSON.stringify(skillsList));
                console.log("Updated GlobalSkills:", skillsList);


                await generateAIReview(fullText);
            } catch (error) {
                console.error("Error extracting text:", error);
                setGlobalSkills([]);
                setAIReview("Failed to process the PDF.");
            } finally {
                setIsLoading(false);
                setProcessingSkills(false);
                event.target.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const generateAIReview = async (text) => {
        if (!text) {
            setAIReview("No text found in the resume.");
            return;
        }

        setIsLoading(true);

        try {
            const review = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Analyze this resume text for strengths, weaknesses, and suggestions: ${text}`;
            const result = await review.generateContent(prompt);
            const response = await result.response;
            setAIReview(response.text());
        } catch (error) {
            console.error("Error generating AI review:", error);
            setAIReview("Failed to generate AI review.");
        } finally {
            setIsLoading(false);
        }
    };

    const deletePdf = () => {
        setCurrentPdf(null);
        setGlobalSkills([]);
        setAIReview('');
        localStorage.removeItem("currentPdf");
        localStorage.removeItem("globalSkills");
    };

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            {!currentPdf ? (
                <h1 className="p-5 text-3xl sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                    Upload Your Resume Below
                </h1>
            ) : (
                <h1 className="text-3xl sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                    AI-Powered Resume Analysis
                </h1>
            )}

            {!currentPdf ? (
                <div className="mb-5 text-center border-2 border-dashed dark:border-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                        <UploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                            Drag and drop or <span className="text-blue-600 dark:text-blue-400">browse</span> your resume
                        </span>
                        <Input
                            type="file"
                            accept="application/pdf"
                            onChange={extractText}
                            disabled={isLoading}
                            className="hidden"
                        />
                        <Button asChild disabled={isLoading}>
                            <span>{isLoading ? "Processing..." : "Upload PDF"}</span>
                        </Button>
                    </label>
                </div>
            ) : (
                <Card className="transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{currentPdf.name}</CardTitle>
                                <CardDescription>{currentPdf.date}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={deletePdf} aria-label="Delete PDF">
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-md font-semibold mb-2">Extracted Skills:</h3>
                        <div className="flex flex-wrap gap-2 bg-black p-2 rounded-md content-center items-center">
    {processingSkills ? (
      
        <Skeleton className="h-8 w-20 rounded-md bg-gray-700" /> 
    ) : (
        globalSkills.map((skill, index) => (
            <div key={index} className="bg-white text-blue-800 text-sm px-3 py-1 rounded-md items-center">
                {skill}
            </div>
        ))
    )}
</div>
                    </CardContent>
                    <CardContent>
                        <h3 className="text-md font-semibold mb-2">AI Review:</h3>
                        {AIReview ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{AIReview}</p>
                        ) : (
                            <Skeleton className="h-20 w-full" />
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UploadResume;
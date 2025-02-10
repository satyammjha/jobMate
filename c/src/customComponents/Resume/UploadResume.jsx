import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Trash2, UploadCloud } from "lucide-react";
import { Progress } from "../../components/ui/progress";

function UploadResume() {
    const [currentPdf, setCurrentPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [processingSkills, setProcessingSkills] = useState(false);

    const genAI = new GoogleGenerativeAI("AIzaSyAx4bapGjEdXuwlAgRwpK2jda5Cmklf5rw");

    useEffect(() => {
        const savedPdf = localStorage.getItem("currentPdf");
        const savedSkills = localStorage.getItem("skills");

        if (savedPdf) {
            setCurrentPdf(JSON.parse(savedPdf));
        }
        if (savedSkills) {
            setSkills(JSON.parse(savedSkills));
        }
    }, []);

    useEffect(() => {
        if (currentPdf) {
            localStorage.setItem("currentPdf", JSON.stringify(currentPdf));
        }
    }, [currentPdf]);

    useEffect(() => {
        if (skills.length > 0) {
            localStorage.setItem("skills", JSON.stringify(skills));
        }
    }, [skills]);

    const extractText = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setProcessingSkills(true);

        const reader = new FileReader();
        reader.onload = async function () {
            try {
                const typedArray = new Uint8Array(reader.result);
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                let extractedText = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    extractedText += textContent.items.map((item) => item.str).join(" ") + "\n";
                }

                const newPdf = {
                    id: Date.now(),
                    name: file.name,
                    text: extractedText || "No text found in the PDF",
                    date: new Date().toLocaleString()
                };
                setCurrentPdf(newPdf);

                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const prompt = `Extract technical skills from this resume text as a comma-separated list. Return only the top 10 skills based on the current industry trends and should be maximum of 10 skills only, nothing else: ${extractedText}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const skillsList = response.text().split(',').map(skill => skill.trim());
                setSkills(skillsList);
            } catch (error) {
                console.error("Error:", error);
                setSkills(["Failed to extract skills. Please try again."]);
            } finally {
                setIsLoading(false);
                setProcessingSkills(false);
                event.target.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const deletePdf = () => {
        setCurrentPdf(null);
        setSkills([]);
        localStorage.removeItem("currentPdf");
        localStorage.removeItem("skills");
    };

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            <div>
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
                            <Button asChild className={`mt-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={deletePdf}
                                    aria-label="Delete PDF"
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-md font-semibold mb-2">Extracted Skills:</h3>
                            <div className="flex flex-wrap gap-2">
                                {processingSkills ? (
                                    <div className="w-full flex flex-col items-center gap-2">
                                        <Progress value={50} className="w-[60%]" />
                                        <span className="text-sm text-gray-500">Analyzing skills...</span>
                                    </div>
                                ) : (
                                    skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                        >
                                            {skill}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button asChild>
                                <label>
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={extractText}
                                        className="hidden"
                                    />
                                    Upload New Resume
                                </label>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default UploadResume;
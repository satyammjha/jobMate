export const geminiAccount = {



}

export const generateFullAnalysisPrompt = (resumeText) => `
You are a professional resume reviewer. Analyze this resume and return your assessment as pure JSON data.

CRITICAL: Your response must be ONLY valid JSON. No markdown, no code blocks, no explanatory text before or after.

Resume Content:
${resumeText}

Return exactly this JSON structure with your analysis:

{
    "overallScore": 85,
    "strengths": [
        "Strong technical skills demonstrated through diverse project portfolio",
        "Quantifiable achievements showing measurable impact",
        "Clear progression in technical complexity across projects",
        "Relevant industry experience with modern technologies",
        "Well-structured presentation of information"
    ],
    "weaknesses": [
        "Missing professional summary or objective statement",
        "Insufficient quantification of business impact in work experience",
        "Contact information lacks professional portfolio links",
        "Skills section could be better organized by category",
        "Limited demonstration of leadership or collaboration skills"
    ],
    "suggestions": [
        "Add a compelling professional summary highlighting key strengths and career goals",
        "Quantify all achievements with specific metrics (percentages, numbers, timeframes)",
        "Include links to GitHub, LinkedIn, and personal portfolio",
        "Reorganize skills into categories: Programming Languages, Frameworks, Tools, etc.",
        "Add more context about team collaboration and leadership roles",
        "Include relevant certifications or ongoing learning initiatives"
    ],
    "skills": ["JavaScript", "React.js", "Node.js", "MongoDB", "Python", "Git", "AWS", "REST APIs", "HTML/CSS", "SQL"],
    "experience": {
        "yearsOfExperience": "2-3",
        "level": "Entry to Mid-level",
        "industries": ["Software Development", "Web Development", "Technology"]
    },
    "formatting": {
        "score": 8,
        "issues": ["Minor inconsistencies in date formatting", "Could benefit from better visual hierarchy", "Some sections need more whitespace"]
    },
    "additionalInsights": {
        "strongestArea": "Technical project execution and full-stack development",
        "improvementPriority": "Professional branding and quantified impact demonstration",
        "careerReadiness": "Ready for junior to mid-level software developer positions",
        "missingElements": ["Professional certifications", "Soft skills demonstration", "Industry keywords optimization"]
    }
}

Analysis Guidelines:
- Overall score: 0-100 (consider technical skills, presentation, completeness, impact)
- Strengths: 3-5 most impressive aspects
- Weaknesses: 3-5 areas needing improvement (constructive, not harsh)
- Suggestions: 4-6 specific, actionable recommendations
- Skills: Extract 8-12 most relevant technical skills mentioned
- Experience level: Assess based on projects, internships, and complexity
- Formatting score: 1-10 for visual presentation and organization
- Additional insights: Provide strategic career guidance

Remember: Return ONLY the JSON object. No other text whatsoever.`;
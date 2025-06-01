import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateFullAnalysisPrompt } from "../config/geminiaccounts.js";

const genAI = new GoogleGenerativeAI("AIzaSyAx4bapGjEdXuwlAgRwpK2jda5Cmklf5rw");

/**
 * Clean AI response by removing markdown code blocks
 * @param {string} response - Raw AI response
 * @returns {string} - Cleaned response
 */
const cleanAIResponse = (response) => {
    return response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[\s\n]*/, '') // Remove leading whitespace
        .replace(/[\s\n]*$/, '') // Remove trailing whitespace
        .trim();
};

/**
 * Generates a comprehensive resume review using Google's Gemini AI
 * @param {string} resumeText - The extracted text from the resume
 * @param {string} analysisType - Type of analysis: 'full', 'skills', 'score' (default: 'full')
 * @param {string} jobDescription - Optional job description for matching analysis
 * @returns {Promise<Object>} - Resume review analysis
 */
export const generateResumeReview = async (resumeText, analysisType = 'full', jobDescription = null) => {
    try {
        if (!resumeText || resumeText.trim().length === 0) {
            throw new Error('Resume text is required and cannot be empty');
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.1, // Lower temperature for more consistent JSON output
                topP: 0.8,
                maxOutputTokens: 4096,
            }
        });

        const prompt = generateFullAnalysisPrompt(resumeText);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        console.log('Raw AI Response:', rawText.substring(0, 200) + '...'); // Debug log

        // Clean the response
        const cleanedText = cleanAIResponse(rawText);
        
        try {
            const parsedResponse = JSON.parse(cleanedText);
            
            // Validate the response structure
            if (!parsedResponse.overallScore || !parsedResponse.strengths) {
                throw new Error('Invalid response structure from AI');
            }
            
            return {
                success: true,
                analysisType,
                data: parsedResponse
            };

        } catch (parseError) {
            console.error('JSON parsing failed:', parseError.message);
            console.error('Cleaned text:', cleanedText);
            
            // Return structured error response
            return {
                success: false,
                error: 'Failed to parse AI response as JSON',
                analysisType,
                rawResponse: rawText,
                cleanedResponse: cleanedText,
                parseError: parseError.message
            };
        }

    } catch (error) {
        console.error('Resume review generation failed:', error);
        return {
            success: false,
            error: error.message,
            analysisType
        };
    }
};

/**
 * Alternative function with retry logic for better reliability
 */
export const generateResumeReviewWithRetry = async (resumeText, analysisType = 'full', maxRetries = 2) => {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Resume analysis attempt ${attempt}/${maxRetries}`);
            
            const result = await generateResumeReview(resumeText, analysisType);
            
            if (result.success) {
                return result;
            }
            
            lastError = result.error;
            console.warn(`Attempt ${attempt} failed:`, result.error);
            
            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
            
        } catch (error) {
            lastError = error.message;
            console.error(`Attempt ${attempt} threw error:`, error);
        }
    }
    
    return {
        success: false,
        error: `All ${maxRetries} attempts failed. Last error: ${lastError}`,
        analysisType
    };
};
import fs from 'fs';
import mammoth from 'mammoth';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Extracts text from PDF or Word documents
 * @param {Object} file - Multer file object with path and mimetype
 * @returns {Promise<string>} - Extracted text content
 */
const extractText = async (file) => {
    try {
        const { path: filePath, mimetype, originalname } = file;
        
        console.log('Processing file at path:', filePath);
        console.log('File exists:', fs.existsSync(filePath));

        if (mimetype === 'application/pdf') {
            const testDataDir = './test/data';
            try {
                if (!fs.existsSync(testDataDir)) {
                    fs.mkdirSync(testDataDir, { recursive: true });
                }
                fs.copyFileSync(filePath, path.join(testDataDir, '05-versions-space.pdf'));
            } catch (dirError) {
                console.log('Could not create test directory:', dirError.message);
            }

            try {
                const { default: pdfParse } = await import('pdf-parse');
                const buffer = fs.readFileSync(filePath);
                const data = await pdfParse(buffer);
                return data.text;
            } catch (pdfError) {
                console.log('PDF parsing failed:', pdfError.message);
                const buffer = fs.readFileSync(filePath);
                const stats = fs.statSync(filePath);
                return `PDF file processed: ${originalname}\nFile size: ${stats.size} bytes\nNote: Text extraction failed, but file was successfully uploaded and processed.`;
            }
            
        } else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword' ||
            originalname?.toLowerCase().endsWith('.docx') ||
            originalname?.toLowerCase().endsWith('.doc')
        ) {
            const buffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer: buffer });
            return result.value;
        } else {
            throw new Error(`Unsupported file type: ${mimetype}. Only PDF and Word documents are supported.`);
        }
    } catch (error) {
        console.error('Extraction error:', error);
        throw new Error(`Text extraction failed: ${error.message}`);
    }
};

export default extractText;
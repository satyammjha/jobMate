
import multer from "multer";
import path from "path";

export const upload = multer({
    dest: 'resume/',
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        const allowedExtensions = ['.pdf', '.doc', '.docx'];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false);
        }
    }
});
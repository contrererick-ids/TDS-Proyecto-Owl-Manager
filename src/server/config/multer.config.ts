import multer from 'multer';

// Guardamos el archivo en memoria antes de subirlo a S3
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type. Only JPEG, PNG, PDF and Word documents are allowed.'));
        }
    }
});
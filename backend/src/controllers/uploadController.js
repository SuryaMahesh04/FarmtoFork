const { put } = require('@vercel/blob');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Generate dynamic unique filename
        const originalName = req.file.originalname.replace(/\s+/g, '-');
        const uniqueFilename = `${Date.now()}-${originalName}`;

        const blob = await put(`certifications/${uniqueFilename}`, req.file.buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: blob.url
            }
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to upload file to storage' });
    }
};

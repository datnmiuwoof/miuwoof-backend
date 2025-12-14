const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadService = {
    async uploadImage(filePath) {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "miuwoof",
            });
            fs.unlinkSync(filePath);
            return result.secure_url;
        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
            throw error;
        }
    },
};

module.exports = uploadService;

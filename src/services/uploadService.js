const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadService = {
    async uploadImage(filePath) {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "miuwoof", // thư mục trên cloud
            });
            fs.unlinkSync(filePath); // xóa file tạm sau khi upload xong
            return result.secure_url;
        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
            throw error;
        }
    },
};

module.exports = uploadService;

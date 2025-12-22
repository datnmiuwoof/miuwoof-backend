const profileService = require("../../services/profileService");
const Joi = require("joi");

class profileController {
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const result = await profileService.getService(userId);
            if (!result) {
                return res.status(400).json({ message: "không tìm thấy user nào" })
            }

            res.status(200).json(result)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    async addAddress(req, res) {
        try {
            const userId = req.user.id;
            const body = req.body

            const result = await profileService.addAddress(userId, body);

            if (!result) {
                return res.status(400).json({ message: "khonog theem duocw address" })
            }

            res.status(200).json({ message: "thêm địa chỉ thành công" })
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                message: error.message || 'Add address failed'
            });
        }

    }

    async updateProfile(req, res) {

        try {
            const body = req.body
            const userId = req.user.id

            const result = await profileService.updateProfile(userId, body)

            if (!result) return res.status(400).json({ message: "lôi khong sửa được" });

            res.status(200).json({ message: "thêm thành công" })

        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

module.exports = new profileController();

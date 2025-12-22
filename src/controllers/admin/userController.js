const userService = require("../../services/userService");
const Joi = require("joi");

class userController {
    //xem all dữ iệu user
    async getAllUser(req, res) {
        try {
            const { page, status } = req.query;
            const limit = 10;

            if (!page || !status) {
                return res.status(400).json({ message: "không tìm thấy page hoặc trang thái" })
            }

            const allUser = await userService.getAlluser(page, status, limit);
            return res.status(200).json({
                data: allUser.rows,
                total: allUser.count,
                page: Number(page),
                totalPages: Math.ceil(allUser.count / limit),
            });
        } catch (error) {
            res.status(500).json({ message: "loi roi ba" })
        }
    }

    async getDetailUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.getDetailuser(id);

            if (!result) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                status: {
                    total_order: result.total_order,
                    total_amount: result.total_amount,
                    averageRounded: result.averageRounded,
                }

            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // userController.ts
    async getStatusUser(req, res) {
        try {
            const { id } = req.params;
            const { activeTab, page } = req.query;

            const result = await userService.statusUser(activeTab, id, page);

            return res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }

    async blockUser(req, res) {
        try {
            const { id } = req.params;

            const result = await userService.userBlock(id);

            if (!result) {
                return res.status(400).json({ message: "không khóa được" })
            }

            return res.status(200).json({ message: "khóa thành công" })
        } catch (error) {
            return res.status(400).json({ message: "không khóa được" })
        }
    }

    async isLocked(req, res) {
        try {
            const { page, status } = req.query;
            const limit = 10;
            const offset = (page - 1) * limit;
            const result = await userService.isLocked(offset, limit, status);

            if (!result) return res.status(400).json({ message: "lỗi không lấy được dữ liệu" });

            res.status(200).json({
                data: result.rows,
                total: result.count,
                page: Number(page),
                totalPages: Math.ceil(result.count / limit),
            })
        } catch (error) {
            return res.status(400).json({ message: error })
        }
    }


    //mở khóa tài khoản
    async unbanUser(req, res) {
        try {
            const { id } = req.params;

            const result = await userService.unbanUser(id);

            if (!result) return res.status(400).json({ message: "không mở khóa được" });

            res.status(200).json({ message: "mở khóa thành công" })
        } catch (error) {
            return res.status(400).json({ message: error });
        }
    }

}

module.exports = new userController();
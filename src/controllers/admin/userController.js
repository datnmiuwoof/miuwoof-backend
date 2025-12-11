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

    async toggleLock(req, res) {
        try {
            const { id } = req.params;
            const updatedUser = await userService.toggleUserLock(id);

            return res.status(200).json({
                message: updatedUser.is_locked ? "Đã khóa tài khoản thành công" : "Đã mở khóa tài khoản thành công",
                data: {
                    id: updatedUser.id,
                    is_locked: updatedUser.is_locked,
                    locked_until: updatedUser.locked_until
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi hệ thống" });
        }
    }

    async changeRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body; // 'admin' hoặc 'user'

            if (!role) return res.status(400).json({ message: "Vui lòng gửi role mới (admin/user)" });

            const updatedUser = await userService.changeUserRole(id, role);

            return res.status(200).json({
                message: "Cập nhật quyền thành công",
                data: {
                    id: updatedUser.id,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi hệ thống" });
        }
    }

}

module.exports = new userController();
const orderService = require("../../services/orderService");
const order = require("../../models/orderModel")

class OrderController {

    async getAllOrder(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const status = req.query.status || "all";
            const limit = 10;

            const data = await orderService.getAlladminorder(page, limit, status);

            if (!data) {
                return res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
            }

            return res.status(200).json({
                data: data.result.rows,
                total: data.result.count,
                statusCounts: data.statusCounts,
                page,
                totalPages: Math.ceil(data.result.count / limit),
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }


    async getDetailOrder(req, res) {

        try {
            const { id } = req.params;
            if (!id) res.status(201).json({ message: "không tìm thấy đơn hàng" });
            const result = await orderService.orderAdminDetail(id);

            res.status(201).json(result);
        } catch (error) {

        }
    }

    async updateStatusOrder(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(404).json({ error: "id not found" });
            const updatedOrder = await orderService.updateOrderStatus(id);
            if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

            res.status(201).json({ message: "cập nhật thành công" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async cancelledOrder(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ error: "id not found" });

            const result = await orderService.cancelledOrderOrder(id);

            if (!result) return res.status(404).json({ error: "Order not found" });
            if (result === "already_cancelled") return res.status(400).json({ error: "Order already cancelled" });

            return res.json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async softDelete(req, res) {
        try {
            const { id } = req.params;

            const orderData = await order.findByPk(id);
            if (!orderData) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }

            await orderData.update({ is_deleted: 1 });

            return res.status(200).json({ message: "Xóa đơn hàng thành công" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getDeletedOrders(req, res) {
        try {
            const { page } = req.query;

            const result = await orderService.getDeletedOrders({
                page: Number(page) || 1,
            });

            res.status(201).json({
                success: true,
                result,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // controllers/admin/order.controller.js
    async restoreOrder(req, res) {
        try {
            const { id } = req.params;

            await orderService.restoreOrder(id);

            return res.json({
                success: true,
                message: "Khôi phục đơn hàng thành công",
            });
        } catch (error) {
            console.log("❌ restoreOrder error:", error);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}


module.exports = new OrderController();
const orderService = require("../../services/orderService");

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

    // async cancelledOrder(req, res) {
    //     const { id } = req.body;
    //     if (!id) return res.status(404).json({ error: "id not found" });

    //     const result = await orderService.cancelledOrderOrder(id);

    //     console.log(result)

    // }
}


module.exports = new OrderController();
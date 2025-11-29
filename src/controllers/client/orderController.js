const orderService = require("../../services/orderService");

class orderController {
    async createOrder(req, res) {
        try {
            const orderData = req.body;
            const userId = req.user.id;
            if (!orderData || Object.keys(orderData).length === 0 || !userId) {
                return res.status(400).json({ message: "Dữ liệu đơn hàng không hợp lệ" });
            }
            const order = await orderService.createOrder({ orderData, userId });
            res.status(201).json({ message: "Order created successfully", data: order });
        } catch (error) {
            console.error("Lỗi khi tạo order:", error);
            res.status(500).json({ message: "Tạo đơn hàng thất bại", error: error.message });
        }
    }
}

module.exports = new orderController();
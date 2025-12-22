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

    async checkOrder(req, res) {
        const { status } = req.params;
        const userId = req.user.id;

        try {
            let data;
            switch (status) {
                case "all":
                    data = await orderService.checkAllOrder(userId);
                    break;
                case "pending":
                    data = await orderService.checkOrderStatus(userId, status);
                    break;
                case "confirmed":
                    data = await orderService.checkOrderStatus(userId, status);
                    break;
                case "shipping":
                    data = await orderService.checkOrderStatus(userId, status);
                    break;
                case "completed":
                    data = await orderService.checkOrderStatus(userId, status);
                    break;
                case "cancelled":
                    data = await orderService.checkOrderStatus(userId, status);
                    break;
                case "refund":
                    data = await orderService.checkOrderStatus(userId, status);
                    break;
                default:
                    return res.status(400).json({ message: "Invalid status" });
            }
            res.status(201).json({ data })
        } catch (error) {
            res.status(400).json({ error })
        }


    }

    async orderDetail(req, res) {
        const { id } = req.params;
        try {
            if (!id) res.status(201).json({ message: "không tìm thấy order" });

            const orderDetail = await orderService.orderDetail(id);

            res.status(201).json(orderDetail);
        } catch (error) {
            res.status(401).json(error);
        }
    }
}

module.exports = new orderController();
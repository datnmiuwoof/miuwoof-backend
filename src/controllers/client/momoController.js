const momoService = require("../../services/momoService");

class MomoController {
    async createOrderMoMo(req, res) {
        try {
            const orderData = req.body;
            const userId = req.user.id;

            if (!orderData?.items?.length || !userId) {
                return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
            }

            const result = await momoService.createOrderMoMo({ orderData, userId });

            return res.status(201).json({
                success: true,
                message: "Tạo link thanh toán Momo thành công",
                data: result
            });

        } catch (error) {
            console.error("Lỗi controller Momo:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Tạo đơn thất bại"
            });
        }
    }

    async handleWebhook(req, res) {
        const body = req.body;
        try {
            if (!momoService.verifySignature(body)) {
                return res.status(400).json({ resultCode: 1, message: 'Invalid signature' });
            }

            await momoService.processWebhook(body);

            res.json({ resultCode: 0, message: 'OK' });
        } catch (error) {

        }
    }

    async getOrderStatus(req, res) {
        try {
            const orderId = req.params.orderId;
            const orderStatus = await momoService.getOrderStatus(orderId);

            res.status(200).json({ orderStatus });

        } catch (err) {
            console.log("Lỗi lấy trạng thái đơn:", err);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
}

module.exports = new MomoController();
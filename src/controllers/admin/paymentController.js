const { order, payment } = require("../../models");

class PaymentController {
    async createPayment(req, res) {
        const { typePatment } = req.body;
        const id = req.user;

        if (!typePatment) {
            return res.status(400).json({ message: "lỗi rồi" })
        }

        if (typePatment === "cod") {

            const newPayment = await payment.create({ user_id: id })
        }
    }
}

module.exports = new PaymentController();

const express = require("express");
const router = express.Router();
const order = require("../../models/orderModel")

router.get("/", (req, res) => {
    res.status(200).json({ status: "OK" });
});

router.get("/:id", async (req, res) => {
    try {
        const { orderId } = req.params;
        const order1 = await order.findOne({ orderId }); // hoặc { momoOrderId: orderId }

        if (!order1) return res.status(404).json({ message: "Không tìm thấy đơn" });

        res.json({
            success: true,
            status: order.paymentStatus,
            orderId: order.orderId,
        });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;

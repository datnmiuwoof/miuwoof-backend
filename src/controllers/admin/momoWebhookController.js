// const crypto = require("crypto");
// const { order, payment } = require("../../models");

// class PaymentWebhookController {
//     async handleWebhook(req, res) {
//         try {
//             const data = req.body;
//             console.log("📩 WEBHOOK NHẬN:", data);

//             const {
//                 partnerCode,
//                 orderId,
//                 requestId,
//                 amount,
//                 orderInfo,
//                 orderType,
//                 transId,
//                 resultCode,
//                 message,
//                 payType,
//                 responseTime,
//                 extraData,
//                 signature
//             } = data;

//             const secretKey = process.env.MOMO_SECRET_KEY;

//             const rawSignature =
//                 "accessKey=" + process.env.MOMO_ACCESS_KEY +
//                 "&amount=" + amount +
//                 "&extraData=" + extraData +
//                 "&message=" + message +
//                 "&orderId=" + orderId +
//                 "&orderInfo=" + orderInfo +
//                 "&orderType=" + orderType +
//                 "&partnerCode=" + partnerCode +
//                 "&payType=" + payType +
//                 "&requestId=" + requestId +
//                 "&responseTime=" + responseTime +
//                 "&resultCode=" + resultCode +
//                 "&transId=" + transId;

//             const computedSignature = crypto
//                 .createHmac("sha256", secretKey)
//                 .update(rawSignature)
//                 .digest("hex");

//             if (computedSignature !== signature) {
//                 console.log("❌ Sai chữ ký!");
//                 return res.status(400).json({ message: "Invalid signature" });
//             }

//             const realOrderId = orderId.split("-")[0];

//             const ord = await order.findByPk(realOrderId);
//             if (!ord) return res.status(404).json({ message: "Order not found" });

//             const pay = await payment.findOne({ where: { order_id: realOrderId } });

//             if (resultCode === 0) {
//                 await ord.update({ status: "paid" });
//                 await pay.update({ status: "success" });
//             } else {
//                 await ord.update({ status: "cancelled" });
//                 await pay.update({ status: "failed" });
//             }

//             return res.json({ message: "success" });

//         } catch (error) {
//             console.log("❌ Lỗi webhook:", error);
//             return res.status(500).json({ message: "Webhook error", error });
//         }
//     }
// }

// module.exports = new PaymentWebhookController();

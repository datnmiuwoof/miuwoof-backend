// services/momoService.js
const orderModel = require("../models/orderModel");
const orderDetailModel = require("../models/orderDetailModel");
const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModel")
const { sequelize, shipping_method, product_variants, discount, cart_item } = require("../models");
const crypto = require("crypto");
const { Op } = require("sequelize");

const PARTNER_CODE = process.env.PARTNER_CODE;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const ENDPOINT = process.env.ENDPOINT;
const RETURN_URL = process.env.MOMO_RETURN_URL;
const NOTIFY_URL = process.env.MOMO_NOTIFY_URL;

class MomoService {
    // async createOrderMoMo({ orderData, userId }) {
    //     const t = await sequelize.transaction();
    //     try {
    //         let addressId;

    //         const checkAddress = await addressModel.findOne({
    //             where: { user_id: userId, is_default: true },
    //             transaction: t,
    //         });

    //         if (checkAddress) {
    //             addressId = checkAddress.id;
    //         } else {
    //             const newAddress = await addressModel.create({
    //                 user_id: userId,
    //                 phone: orderData.phone,
    //                 district: orderData.district,
    //                 address_line: orderData.address,
    //                 ward: orderData.ward,
    //                 city: orderData.city,
    //                 name: orderData.name,
    //                 is_default: true,
    //             }, { transaction: t });
    //             addressId = newAddress.id;
    //         }

    //         let shippingFee = 0;

    //         // chỉ lấy shipping khi có id
    //         if (orderData.shipping_method_id) {
    //             const shippingMethod = await shipping_method.findByPk(
    //                 orderData.shipping_method_id
    //             );

    //             if (!shippingMethod) {
    //                 throw new Error("Shipping method không tồn tại");
    //             }

    //             shippingFee = shippingMethod.shipping_fee;
    //         }


    //         const PriceNotSgipper = orderData.items.reduce(
    //             (sum, item) => sum + item.final_price * item.quantity,
    //             0
    //         );

    //         const totalPrice = PriceNotSgipper + shippingFee;


    //         //3. Tạo đơn hàng thật
    //         const newOrder = await orderModel.create({
    //             user_id: userId,
    //             address_id: addressId,
    //             total_amount: totalPrice,
    //             order_status: "pending",
    //             payment_status: "pending",
    //             order_date: new Date(),
    //             shipping_method_id: orderData.shipping_method_id || 1,
    //             discount_id: orderData.discount_id || null,
    //         }, { transaction: t });

    //         //4. Tạo chi tiết đơn
    //         for (const item of orderData.items) {
    //             await orderDetailModel.create({
    //                 order_id: newOrder.id,
    //                 product_variant_id: item.product_variant_id,
    //                 name: item.name,
    //                 image: item.Image,
    //                 price: item.price,
    //                 quantity: item.quantity,
    //             }, { transaction: t });
    //         }

    //         const momoOrderId = `${newOrder.id}-${Date.now()}`;
    //         const requestId = momoOrderId;
    //         const amount = totalPrice.toString();
    //         const orderInfo = `Thanh toán đơn hàng #${newOrder.id}`;
    //         const extraData = Buffer.from(newOrder.id.toString()).toString("base64");

    //         const rawSignature = `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${NOTIFY_URL}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${PARTNER_CODE}&redirectUrl=${RETURN_URL}&requestId=${requestId}&requestType=payWithMethod`;


    //         const signature = crypto
    //             .createHmac("sha256", SECRET_KEY)
    //             .update(rawSignature)
    //             .digest("hex");

    //         const requestBody = {
    //             partnerCode: PARTNER_CODE,
    //             accessKey: ACCESS_KEY,
    //             requestId,
    //             amount,
    //             orderId: momoOrderId,
    //             orderInfo,
    //             redirectUrl: RETURN_URL,
    //             ipnUrl: NOTIFY_URL,
    //             extraData,
    //             requestType: "payWithMethod",
    //             signature,
    //             lang: "vi",
    //         };

    //         const momoResponse = await fetch(ENDPOINT, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(requestBody),
    //         });

    //         const momoData = await momoResponse.json();

    //         if (momoData.resultCode !== 0) {
    //             await t.rollback();
    //             throw new Error(momoData.message || "Lỗi kết nối Momo");
    //         }

    //         await newOrder.update({
    //             payment_id: momoOrderId,
    //             pay_url: momoData.payUrl,
    //             qr_code_url: momoData.qrCodeUrl,
    //             payment_extra: extraData,
    //         }, { transaction: t });

    //         await t.commit();

    //         return {
    //             success: true,
    //             orderId: newOrder.id,
    //             order_id: newOrder.id,
    //             total_amount: newOrder.total_amount,
    //             payUrl: momoData.payUrl,
    //             qrCodeUrl: momoData.qrCodeUrl,
    //             deeplink: momoData.deeplink,
    //         };

    //     } catch (error) {
    //         // Chỉ rollback khi còn sống
    //         try {
    //             await t.rollback();
    //         } catch (e) { }

    //         console.error("Lỗi xử lý IPN MoMo:", error);
    //     }
    // }

    async createOrderMoMo({ orderData, userId }) {
        const t = await sequelize.transaction();
        try {
            /* ================== 1. ADDRESS ================== */
            let addressId;

            const checkAddress = await addressModel.findOne({
                where: { user_id: userId, is_default: true },
                transaction: t,
            });

            if (checkAddress) {
                addressId = checkAddress.id;
            } else {
                const newAddress = await addressModel.create({
                    user_id: userId,
                    phone: orderData.phone,
                    district: orderData.district,
                    address_line: orderData.address,
                    ward: orderData.ward,
                    city: orderData.city,
                    name: orderData.name,
                    is_default: true,
                }, { transaction: t });

                addressId = newAddress.id;
            }

            /* ================== 2. SHIPPING ================== */
            let shippingFee = 0;

            if (orderData.shipping_method_id) {
                const shippingMethod = await shipping_method.findByPk(
                    orderData.shipping_method_id,
                    { transaction: t }
                );

                if (!shippingMethod) {
                    throw new Error("Shipping method không tồn tại");
                }

                shippingFee = shippingMethod.shipping_fee;
            }

            /* ================== 3. SUBTOTAL ================== */
            const subtotal = orderData.items.reduce(
                (sum, item) => sum + item.final_price * item.quantity,
                0
            );

            /* ================== 4. DISCOUNT (BACKEND TỰ TÍNH) ================== */
            let discountAmount = 0;
            let discountId = null;

            if (orderData.discount_id) {
                const voucher = await discount.findByPk(
                    orderData.discount_id,
                    { transaction: t }
                );

                if (!voucher || !voucher.is_active) {
                    throw new Error("Mã giảm giá không hợp lệ");
                }

                const now = new Date();

                if (voucher.start_date && now < voucher.start_date) {
                    throw new Error("Mã giảm giá chưa bắt đầu");
                }

                if (voucher.end_date && now > voucher.end_date) {
                    throw new Error("Mã giảm giá đã hết hạn");
                }

                if (subtotal < voucher.min_order_value) {
                    throw new Error(
                        `Đơn tối thiểu ${voucher.min_order_value.toLocaleString('vi-VN')}₫`
                    );
                }

                // discount_value = % (vd: 15)
                discountAmount = Math.floor(
                    subtotal * voucher.discount_value / 100
                );

                if (voucher.max_order_value && discountAmount > voucher.max_order_value) {
                    discountAmount = voucher.max_order_value;
                }

                discountId = voucher.id;
            }

            /* ================== 5. TOTAL ================== */
            const totalPrice = subtotal + shippingFee - discountAmount;

            /* ================== 6. CREATE ORDER ================== */
            const newOrder = await orderModel.create({
                user_id: userId,
                address_id: addressId,

                subtotal: subtotal,
                shipping_fee: shippingFee,

                discount_amount: discountAmount, // 🔥 snapshot
                discount_id: discountId,

                total_amount: totalPrice,

                order_status: "pending",
                payment_status: "pending",
                order_date: new Date(),
                shipping_method_id: orderData.shipping_method_id || null,
            }, { transaction: t });

            /* ================== 7. ORDER ITEMS ================== */
            for (const item of orderData.items) {
                await orderDetailModel.create({
                    order_id: newOrder.id,
                    product_variant_id: item.product_variant_id,
                    name: item.name,
                    image: item.Image,
                    price: item.final_price,
                    quantity: item.quantity,
                }, { transaction: t });
            }

            /* ================== 8. MOMO ================== */
            const momoOrderId = `${newOrder.id}-${Date.now()}`;
            const requestId = momoOrderId;
            const amount = totalPrice.toString();
            const orderInfo = `Thanh toán đơn hàng #${newOrder.id}`;
            const extraData = Buffer
                .from(newOrder.id.toString())
                .toString("base64");

            const rawSignature =
                `accessKey=${ACCESS_KEY}` +
                `&amount=${amount}` +
                `&extraData=${extraData}` +
                `&ipnUrl=${NOTIFY_URL}` +
                `&orderId=${momoOrderId}` +
                `&orderInfo=${orderInfo}` +
                `&partnerCode=${PARTNER_CODE}` +
                `&redirectUrl=${RETURN_URL}` +
                `&requestId=${requestId}` +
                `&requestType=payWithMethod`;

            const signature = crypto
                .createHmac("sha256", SECRET_KEY)
                .update(rawSignature)
                .digest("hex");

            const requestBody = {
                partnerCode: PARTNER_CODE,
                accessKey: ACCESS_KEY,
                requestId,
                amount,
                orderId: momoOrderId,
                orderInfo,
                redirectUrl: RETURN_URL,
                ipnUrl: NOTIFY_URL,
                extraData,
                requestType: "payWithMethod",
                signature,
                lang: "vi",
            };

            const momoResponse = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const momoData = await momoResponse.json();

            if (momoData.resultCode !== 0) {
                await t.rollback();
                throw new Error(momoData.message || "Lỗi kết nối MoMo");
            }

            await newOrder.update({
                payment_id: momoOrderId,
                pay_url: momoData.payUrl,
                qr_code_url: momoData.qrCodeUrl,
                payment_extra: extraData,
            }, { transaction: t });

            await t.commit();

            return {
                success: true,
                orderId: newOrder.id,
                total_amount: newOrder.total_amount,
                payUrl: momoData.payUrl,
                qrCodeUrl: momoData.qrCodeUrl,
                deeplink: momoData.deeplink,
            };

        } catch (error) {
            try { await t.rollback(); } catch (e) { }
            console.error("Lỗi tạo đơn MoMo:", error);
            throw error;
        }
    }



    async verifySignature(data) {
        const rawSignature = `partnerCode=${data.partnerCode}
        &accessKey=${process.env.MOMO_ACCESS_KEY}
        &requestId=${data.requestId}
        &amount=${data.amount}
        &orderId=${data.orderId}
        &orderInfo=${data.orderInfo}
        &orderType=${data.orderType}
        &transId=${data.transId}
        &resultCode=${data.resultCode}
        &message=${data.message}
        &payType=${data.payType}
        &responseTime=${data.responseTime}
        &extraData=${data.extraData}
        `;

        const signature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(rawSignature)
            .digest("hex");

        return signature === data.signature;
    }

    async processWebhook(webhookData) {
        const {
            orderId,
            resultCode,
            message,
            transId
        } = webhookData;

        const newOrderId = parseInt(orderId.split('-')[0], 10);

        if (resultCode !== 0 && resultCode !== "0") {
            console.log("MoMo IPN thất bại:", resultCode, message || "");
            return;
        }

        const t = await sequelize.transaction();

        try {
            const order = await orderModel.findOne({
                where: { id: newOrderId },
                include: [
                    {
                        model: orderDetailModel,
                        include: [
                            {
                                model: product_variants,
                            }
                        ]
                    }
                ],
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!order) {
                await t.rollback();
                console.log("Không tìm thấy đơn hàng với id:", orderId);
                return;
            }

            if (order.payment_status === "paid") {
                await t.commit();
                console.log("Đơn hàng đã được thanh toán trước đó");
                return;
            }

            await orderModel.update(
                {
                    payment_status: "paid",
                    momo_trans_id: transId || null,
                    paid_at: new Date()
                },
                {
                    where: { id: orderId },
                    transaction: t
                }
            );

            for (let items of order.OrderDetails) {
                const variant = items.product_variant_id;
                const quantity = items.quantity;

                await product_variants.decrement('available_quantity', {
                    by: quantity,
                    where: { id: variant },
                    transaction: t
                });
            }

            if (order.user_id) {
                const cart = await cartModel.findOne({
                    where: { user_id: order.user_id },
                    transaction: t
                });

                if (!cart) {
                    console.log(`Không có cart cho user bỏ qua xóa giỏ`);
                } else {
                    const boughtVariantIds = order.OrderDetails.map(
                        item => item.product_variant_id
                    );

                    await cart_item.destroy({
                        where: {
                            cart_id: cart.id,
                            product_variants_id: boughtVariantIds
                        },
                    });

                    const remaining = await cart_item.count({
                        where: { cart_id: cart.id },
                        transaction: t
                    });

                    if (remaining === 0) {
                        await cartModel.destroy({
                            where: { user_id: user_id },
                            transaction: t
                        });

                        console.log(`Giỏ của user trống → đã xóa luôn cart`);
                    }
                }
            }

            await t.commit();
            console.log(`Thanh toán MoMo thành công - Đơn ${orderId} đã trừ kho ${order.OrderDetails.length} sản phẩm`);

        } catch (error) {
            try {
                await t.rollback();
            } catch (e) {
                console.error("Lỗi xử lý IPN MoMo:", error);
            }
        }
    }
}

module.exports = new MomoService();
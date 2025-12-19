const orderModel = require("../models/orderModel");
const orderDetailModel = require("../models/orderDetailModel");
const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModel");
const user = require('../models/userModel')
const cartItemModel = require("../models/cartItemModel");
const { sequelize, product_variants, order_detail, cart, discount, address, shipping_method } = require("../models");
const { Op } = require("sequelize");

const flow = ["pending", "confirmed", "shipping", "completed", "cancelled", "refund"];
function getNextStatus(current) {
    const i = flow.indexOf(current);
    return flow[i + 1] || current;
}

class orderService {

    // tạo đơn hàng khi người dùng vừa bấm thanh toán
    async createOrder({ orderData, userId }) {

        const t = await sequelize.transaction();
        try {
            let addressId;

            const checkAddress = await addressModel.findOne({
                where: { user_id: userId, is_default: true },
                transaction: t
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
                    is_default: true,
                }, { transaction: t });


                addressId = newAddress.id;
            }

            let shippingFee = 0;

            // chỉ lấy shipping khi có id
            if (orderData.shipping_method_id) {
                const shippingMethod = await shipping_method.findByPk(
                    orderData.shipping_method_id
                );

                if (!shippingMethod) {
                    throw new Error("Shipping method không tồn tại");
                }

                shippingFee = shippingMethod.shipping_fee;
            }

            const PriceNotSgipper = orderData.items.reduce(
                (sum, item) => sum + item.final_price * item.quantity,
                0
            );

            // discount phần giảm theo code
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

                if (PriceNotSgipper < voucher.min_order_value) {
                    throw new Error(
                        `Đơn tối thiểu ${voucher.min_order_value.toLocaleString('vi-VN')}₫`
                    );
                }

                // discount_value = % (ví dụ 15)
                discountAmount = Math.floor(
                    PriceNotSgipper * voucher.discount_value / 100
                );

                if (voucher.max_order_value && discountAmount > voucher.max_order_value) {
                    discountAmount = voucher.max_order_value;
                }

                discountId = voucher.id;
            }

            const totalPrice = PriceNotSgipper + shippingFee - discountAmount;

            const newOrder = await orderModel.create({
                user_id: userId,
                address_id: addressId,
                total_amount: totalPrice,
                order_status: "pending",
                payment_status: "pending",
                discount_amount: discountAmount,
                discount_id: discountId || null,
                order_date: new Date(),
                shipping_method_id: orderData.shipping_method_id || 1,

            }, { transaction: t });

            for (const item of orderData.items) {
                await orderDetailModel.create({
                    order_id: newOrder.id,
                    product_variant_id: item.product_variant_id,
                    name: item.name,
                    image: item.Image,
                    price: item.price,
                    quantity: item.quantity,
                }, { transaction: t });
            }

            try {

                for (let item of orderData.items) {
                    const quantityorder = item.quantity;
                    const variant = item.product_variant_id;
                    await product_variants.decrement("available_quantity", {
                        by: quantityorder,
                        where: { id: variant },
                        transaction: t,
                    }
                    )
                }

                if (userId) {
                    const cartUser = await cartModel.findOne({
                        where: { user_id: userId },
                        transaction: t,
                    });

                    if (cartUser) {
                        const allVariantId = orderData.items.map(v => v.product_variant_id);

                        await cartItemModel.destroy({
                            where: {
                                cart_id: cartUser.id,
                                product_variants_id: {
                                    [Op.in]: allVariantId
                                }
                            },
                            transaction: t
                        });

                        const remaining = await cartItemModel.count({
                            where: { cart_id: cartUser.id },
                            transaction: t
                        })


                        if (remaining === 0) {
                            await cartModel.destroy({
                                where: { user_id: userId },
                                transaction: t,
                            })
                        }
                    } else {
                        console.log("không thể xóa cart")
                    }
                }
            } catch (error) {

            }

            await t.commit();

            return newOrder;
        } catch (error) {
            await t.rollback();
            console.error("Lỗi service tạo đơn hàng:", error);
            throw new Error("Tạo đơn hàng thất bại.");
        }
    }

    // trang tất cả các đơn hàng
    async checkAllOrder(user) {
        try {
            const dataOrder = await orderModel.findAll(
                {
                    where: { user_id: user },
                    include: [
                        {
                            model: orderDetailModel,
                            include: [
                                {
                                    model: product_variants,
                                }
                            ]
                        }
                    ]
                }
            );

            return dataOrder;
        } catch (error) {
            return false;
        }

    }

    // trang các đơn hàng theo trang thái
    async checkOrderStatus(user, status) {
        try {
            const dataOrder = await orderModel.findAll(
                {
                    where: { user_id: user, order_status: status },
                    include: [
                        {
                            model: orderDetailModel,
                            include: [
                                {
                                    model: product_variants,
                                }
                            ]
                        }
                    ]
                }
            );

            return dataOrder;
        } catch (error) {
            return false;
        }

    }

    // trang đơn hàng chi tiết
    async orderDetail(detail_id) {
        try {
            const dataOrder = await orderDetailModel.findOne(
                {
                    where: { id: detail_id },
                    include: [
                        {
                            model: product_variants,
                        },
                        {
                            model: orderModel
                        }
                    ],
                }
            );

            return dataOrder;
        } catch (error) {
            return false;
        }

    }

    //tất cả đơn hàng của admin
    async getAlladminorder(page, limit, status) {
        try {
            const offset = (page - 1) * limit;
            let where = {};

            if (status && status !== "all") {
                where.order_status = status;
            }

            const result = await orderModel.findAndCountAll({
                where,
                include: [
                    { model: orderDetailModel },
                    { model: user }
                ],
                limit,
                offset,
                order: [["id", "DESC"]],
            });

            const allOrders = await orderModel.findAll();
            const statusCounts = {
                all: allOrders.length,
                pending: allOrders.filter(o => o.order_status === 'pending').length,
                confirmed: allOrders.filter(o => o.order_status === 'confirmed').length,
                shipping: allOrders.filter(o => o.order_status === 'shipping').length,
                completed: allOrders.filter(o => o.order_status === 'completed').length,
                cancelled: allOrders.filter(o => o.order_status === 'cancelled').length,
                refund: allOrders.filter(o => o.order_status === 'refund').length,
            };

            return { result, statusCounts };
        } catch (error) {
            return false;
        }
    }

    // trang chi tiết của đơn hàng của Admin
    async orderAdminDetail(id) {
        try {
            const orderAdmin = await orderModel.findOne({
                where: { id: id },
                include: [
                    {
                        model: orderDetailModel,
                        include: [
                            { model: product_variants }
                        ]
                    },
                    { model: address },
                ]
            });
            return orderAdmin;
        } catch (error) {
            return false;
        }
    }

    async updateOrderStatus(id) {
        try {
            const order = await orderModel.findByPk(id);
            if (!order) return false;

            const nextStatus = getNextStatus(order.order_status);

            if (nextStatus === "cancelled") return

            order.order_status = nextStatus;

            if (nextStatus === "completed") {
                order.payment_status = "paid";

            }

            await order.save();
            return order;
        } catch (error) {
            return false;
        }
    }


    async cancelledOrderOrder(orderId) {
        const t = await sequelize.transaction();
        try {
            const order = await orderModel.findOne({
                where: { id: orderId },
                include: [
                    {
                        model: order_detail,
                        include: [{ model: product_variants }]
                    }
                ],
                transaction: t
            });

            if (!order) {
                await t.rollback();
                return null;
            }

            if (order.order_status === "cancelled") {
                await t.rollback();
                return "already_cancelled";
            }

            const orderDetailsArray = order.order_details || order.OrderDetails || [];

            for (const item of orderDetailsArray) {
                await product_variants.increment("available_quantity", {
                    by: item.quantity,
                    where: { id: item.product_variant_id },
                    transaction: t,
                });
            }

            // Hủy đơn
            order.order_status = "cancelled";
            await order.save({ transaction: t });

            await t.commit();

            return order.toJSON();
        } catch (error) {
            await t.rollback();
            console.error(error);
            throw error;
        }
    }

};

module.exports = new orderService();
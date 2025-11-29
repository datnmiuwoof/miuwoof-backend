const orderModel = require("../models/orderModel");
const orderDetailModel = require("../models/orderDetailModel");
const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModel");
const cartItemModel = require("../models/cartItemModel");
const { sequelize, product_variants, cart } = require("../models");
const { Op } = require("sequelize");

class orderService {
    async createOrder({ orderData, userId }) {
        console.log("log orderdata, userId", orderData);
        console.log("log orderdata, userId", userId);

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
                    name: orderData.name,
                    is_default: true,
                }, { transaction: t });


                addressId = newAddress.id;
            }

            const totalPrice = orderData.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );


            const newOrder = await orderModel.create({
                user_id: userId,
                address_id: addressId,
                total_amount: totalPrice,
                order_status: "pending",
                payment_status: "pending",
                order_date: new Date(),
                shipping_method_id: orderData.shipping_method_id || 1,
                discount_id: orderData.discount_id || null

            }, { transaction: t });

            for (const item of orderData.items) {
                console.log("item", item)
                await orderDetailModel.create({
                    order_id: newOrder.id,
                    product_variant_id: item.product_variant_id,
                    name: item.name,
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

                        console.log("remaining", remaining)

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
};

module.exports = new orderService();
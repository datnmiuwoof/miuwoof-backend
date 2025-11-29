// src/services/cartService.js

const db = require("../models");
const { cart, cart_item: cartItem, product_variants, product_image } = db; // <-- QUAN TRỌNG: lấy đúng tên model
const { v4: uuidv4 } = require("uuid"); // npm install uuid nếu chưa có

class CartService {
    async getCart(userId) {
        let userCart = await cart.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: cartItem,
                    as: "items",
                    include: [
                        {
                            model: product_variants,
                            as: "product_variant",
                            attributes: ["id", "price", "image", "size", "style", "unit", "flavor"],
                            include: [
                                {
                                    model: product_image,
                                    as: "ProductImages",
                                    attributes: ["id", "image"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!userCart) {
            userCart = await cart.create({ user_id: userId });
            userCart.items = [];
        }

        const formattedItems = userCart.items.map(i => {
            const variant = i.product_variant;
            const variantImage = variant?.ProductImages?.[0]?.image || variant?.image || "";

            return {
                id: i.id,
                name: i.name,
                price: Number(i.price),
                quantity: i.quantity,
                totalPrice: Number(i.price) * i.quantity,
                image: variantImage, // ảnh hiển thị chung
                variant: {
                    id: variant?.id,
                    price: Number(variant?.price || 0),
                    size: variant?.size,
                    style: variant?.style,
                    unit: variant?.unit,
                    flavor: variant?.flavor,
                    image: variantImage, // đồng bộ variant.image với image
                }
            };
        });

        return {
            id: userCart.id,
            user_id: userCart.user_id,
            items: formattedItems
        };
    }

    async addItem(userId, items = []) {
        console.log(userId);
        console.log(items);
        const userCart = await this.getCart(userId);

        for (const item of items) {
            const variantId = item.variant?.id || null;

            let existing = await cartItem.findOne({
                where: {
                    cart_id: userCart.id,
                    product_variants_id: variantId
                }
            });

            if (existing) {
                existing.quantity += item.quantity || 1;
                existing.total_price = existing.quantity * (item.price || 0);
                await existing.save();
            } else {
                await cartItem.create({
                    cart_id: userCart.id,
                    product_variants_id: variantId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total_price: item.price * item.quantity,
                });
            }
        }


        return await this.getCart(userId);
    }


    async updateItem(itemId, quantityChange) {
        const item = await cartItem.findByPk(itemId);
        if (!item) return null;

        const currentQty = Number(item.quantity);
        let newQty = currentQty + Number(quantityChange);

        // ❗Không cho xuống dưới 1
        if (newQty < 1) newQty = 1;

        item.quantity = newQty;
        item.total_price = newQty * Number(item.price);

        await item.save();
    }



    async removeItem(itemId) {
        const item = await cartItem.findByPk(itemId);
        if (!item) return;

        await item.destroy();
    }

    // SYNC KHI LOGIN
    async syncCart(userId, items = []) {
        await cartItem.destroy({ where: { cart_id: (await this.getCart(userId)).id } });
        return this.addItem(userId, items);
    }
}

module.exports = new CartService();
// src/services/favoriteService.js
const { favorite, product, product_image, product_variants } = require("../models");

class FavoriteService {
    async toggleFavorite(userId, productId) {
        try {
            // Kiểm tra xem đã thích chưa
            const existingFavorite = await favorite.findOne({
                where: {
                    user_id: userId,
                    product_id: productId
                }
            });

            if (existingFavorite) {
                // Nếu đã có -> Xóa (Bỏ thích)
                await existingFavorite.destroy();
                return {
                    status: "removed",
                    message: "Đã bỏ sản phẩm khỏi danh sách yêu thích"
                };
            } else {

                await favorite.create({
                    user_id: userId,
                    product_id: productId
                });
                return {
                    status: "added",
                    message: "Đã thêm sản phẩm vào danh sách yêu thích"
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async getFavorites(userId) {
        try {
            const favorites = await favorite.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: product,
                        attributes: ['id', 'name', 'slug', 'is_hot', 'is_active', 'brand_id'],
                        include: [
                            {
                                model: product_variants,
                                limit: 1,
                                attributes: ['id', 'price', 'import_price'],
                                include: [{
                                    model: product_image,
                                    limit: 1,
                                    attributes: ['image']
                                }]
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return favorites;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FavoriteService();

const favoriteService = require("../../services/favoriteService");

class FavoriteController {
    
    async toggle(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: "Thiếu productId" });
            }

            const result = await favoriteService.toggleFavorite(userId, productId);

            return res.status(200).json(result);

        } catch (error) {
            console.error("Lỗi toggle favorite:", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }

    async getList(req, res) {
        try {
            const userId = req.user.id;
            const favorites = await favoriteService.getFavorites(userId);

            return res.status(200).json({
                message: "Lấy danh sách yêu thích thành công",
                data: favorites
            });
        } catch (error) {
            console.error("Lỗi get favorites:", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }
}

module.exports = new FavoriteController();
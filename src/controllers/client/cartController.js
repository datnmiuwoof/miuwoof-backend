const CartService = require("../../services/cartService");

class CartController {
    async getCart(req, res) {
        try {
            const fullCart = await CartService.getCart(req.user.id);
            res.json(fullCart);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Lỗi lấy giỏ hàng" });
        }
    }

    async addItem(req, res) {
        try {
            const items = req.body.items;
            const userId = req.user.id;

            const result = await CartService.addItem(userId, items);

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Lỗi lưu giỏ hàng" });
        }
    }

    async updateItem(req, res) {
        const { quantity } = req.body;
        const { id } = req.params;

        await CartService.updateItem(Number(id), quantity);

        res.status(204).send();
    }

    async removeItem(req, res) {
        const { id } = req.params;
        await CartService.removeItem(Number(id));
        res.json({ success: true });
    }

    async syncCart(req, res) {
        const items = req.body.items;
        const cart = await CartService.syncCart(req.user.id, items);
        res.json(cart);
    }
}

module.exports = new CartController();

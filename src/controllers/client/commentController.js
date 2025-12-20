const commentService = require("../../services/commentService");

class CommentController {
    async create(req, res) {
        const userId = req.user.id
        const { orderId, rating, content } = req.body;

        try {
            const comment = await commentService.createComment(userId, orderId, rating, content);
            res.status(200).json({ message: 'Comment created', comment });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getByProduct(req, res) {
        const { productVariantId } = req.query;
        if (!productVariantId) return res.status(400).json({ message: 'Missing productVariantId' });

        try {
            const comments = await commentService.getCommentsByProduct(productVariantId);
            res.status(200).json({ comments });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new CommentController();
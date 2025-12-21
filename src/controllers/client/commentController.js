const commentService = require("../../services/commentService");

class CommentController {
    async create(req, res) {
        const userId = req.user.id
        const { orderDetailId, rating, content } = req.body;

        try {
            const comment = await commentService.createComment(userId, orderDetailId, rating, content);
            res.status(200).json({ message: 'Comment created', comment });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    // async getByProduct(req, res) {
    //     const { productVariantId } = req.query;
    //     if (!productVariantId) return res.status(400).json({ message: 'Missing productVariantId' });

    //     try {
    //         const comments = await commentService.getCommentsByProduct(productVariantId);
    //         res.status(200).json({ comments });
    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // }

    async getComment(req, res) {
        try {
            const { slug } = req.params;
            const { rating, sort } = req.query;

            const data = await commentService.getCommentByProduct({ slug, rating, sort });

            return res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            console.error("Lỗi getComment controller:", err);
            return res.status(500).json({
                success: false,
                message: "Lỗi lấy bình luận"
            });
        }
    }
}


module.exports = new CommentController();
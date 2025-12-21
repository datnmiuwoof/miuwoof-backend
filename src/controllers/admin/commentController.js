const CommentService = require('../../services/commentService');

class CommentController {
    async getAll(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                rating,
                status,
            } = req.query;

            const data = await CommentService.getAdminComments({
                page: Number(page),
                limit: Number(limit),
                rating,
                status,
            });

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi lấy danh sách đánh giá'
            });
        }
    }

    async getDetail(req, res) {
        try {
            const { id } = req.params;

            const review = await CommentService.getAdminCommentDetail(id);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đánh giá'
                });
            }

            return res.json({
                success: true,
                data: review
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi lấy chi tiết đánh giá'
            });
        }
    }

    async remove(req, res) {
        try {
            const { id } = req.params;
            await CommentService.deleteComment(id);

            return res.json({
                success: true,
                message: 'Xóa đánh giá thành công'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi xóa đánh giá'
            });
        }
    }

    async toggleVisibility(req, res) {
        try {
            const { id } = req.params;
            await CommentService.toggleVisibility(id);

            return res.json({ success: true, message: 'Đổi trạng thái thành công' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Lỗi đổi trạng thái' });
        }
    }
}

module.exports = new CommentController();

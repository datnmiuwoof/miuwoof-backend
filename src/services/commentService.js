const { review, order_detail, order } = require('../models');

class CommentService {

    async createComment(userId, orderDetailId, rating, content) {
        // Input validation
        if (!userId || !orderDetailId || !rating || !content?.trim()) {
            throw new Error('Thiếu thông tin bắt buộc để tạo đánh giá');
        }

        if (rating < 1 || rating > 5) {
            throw new Error('Điểm đánh giá phải từ 1 đến 5');
        }

        if (typeof content !== 'string' || content.trim().length < 10) {
            throw new Error('Nội dung đánh giá phải ít nhất 10 ký tự');
        }

        const orderDetail = await order_detail.findOne({
            where: { id: orderDetailId },
            include: [{
                model: order,
                attributes: ['id', 'user_id', 'order_status', 'payment_status'],
            }],
            attributes: ['id', 'order_id'],
        });

        if (!orderDetail || !orderDetail.Order) {
            throw new Error('Không tìm thấy chi tiết đơn hàng hoặc đơn hàng liên quan');
        }

        // Ngăn đánh giá trùng
        const existingReview = await review.findOne({
            where: {
                user_id: userId,
                order_detail_id: orderDetailId,
            },
        });

        if (existingReview) {
            throw new Error('Bạn đã đánh giá sản phẩm này rồi');
        }

        // Tạo đánh giá
        return await review.create({
            user_id: userId,
            order_detail_id: orderDetailId,
            rating,
            content: content.trim(),
        });
    }

    // async getCommentsByProduct(productVariantId) {
    //     return await review.findAll({
    //         include: [
    //             {
    //                 model: order_detail,
    //                 where: { product_variant_id: productVariantId },
    //                 attributes: ['id', 'order_id', 'product_variant_id'],
    //             },
    //         ],
    //         order: [['createdAt', 'DESC']],
    //     });
    // }
}

module.exports = new CommentService();

const { review, order_detail, order, product_variants, product, user } = require('../models');
const orderModel = require('../models/orderModel')
class CommentService {

    async createComment(userId, orderDetailId, rating, content) {
        // 1️⃣ Validate input
        if (!userId || !orderDetailId || !rating || !content?.trim()) {
            throw new Error('Thiếu thông tin bắt buộc để tạo đánh giá');
        }

        if (rating < 1 || rating > 5) {
            throw new Error('Điểm đánh giá phải từ 1 đến 5');
        }

        if (typeof content !== 'string' || content.trim().length < 10) {
            throw new Error('Nội dung đánh giá phải ít nhất 10 ký tự');
        }

        // 2️⃣ Lấy order_detail + order
        const orderDetail = await order_detail.findOne({
            where: { id: orderDetailId },
            include: [{
                model: order,
                attributes: ['id', 'user_id', 'order_status'],
            }],
        });

        if (!orderDetail || !orderDetail.Order) {
            throw new Error('Không tìm thấy chi tiết đơn hàng');
        }

        // 3️⃣ Check đúng user
        if (orderDetail.Order.user_id !== userId) {
            throw new Error('Bạn không có quyền đánh giá đơn hàng này');
        }

        // 4️⃣ Chỉ cho đánh giá khi hoàn thành
        if (orderDetail.Order.order_status !== 'completed') {
            throw new Error('Chỉ có thể đánh giá khi đơn hàng đã hoàn thành');
        }

        // 5️⃣ Ngăn đánh giá trùng (THEO order_detail)
        const existingReview = await review.findOne({
            where: {
                user_id: userId,
                order_detail_id: orderDetailId,
            },
        });

        if (existingReview) {
            throw new Error('Bạn đã đánh giá sản phẩm này rồi');
        }

        // 6️⃣ Tạo đánh giá
        return await review.create({
            user_id: userId,
            order_detail_id: orderDetailId,
            rating,
            content: content.trim(),
        });
    }

    async getCommentByProduct({ slug, rating, sort }) {
        const order = [];
        switch (sort) {
            case "newest":
                order.push(["createdAt", "DESC"]);
                break;
            case "oldest":
                order.push(["createdAt", "ASC"]);
                break;
            default:
                order.push(["createdAt", "DESC"]);
        }

        const reviews = await review.findAll({
            where: {
                is_active: false,
                ...rating && rating !== "all" ? { rating: Number(rating) } : {}
            },
            include: [
                {
                    model: order_detail,
                    required: true, // bắt buộc phải có order_detail
                    include: [
                        {
                            model: product_variants,
                            required: true, // bắt buộc phải có product_variants
                            include: [
                                {
                                    model: product,
                                    required: true, // bắt buộc phải đúng product slug
                                    where: { slug }
                                }
                            ]
                        },
                        {
                            model: orderModel,
                            include: [{ model: user, attributes: ["id", "name"] }]
                        }
                    ]
                }
            ],
            order: sort === "oldest" ? [["createdAt", "ASC"]] : [["createdAt", "DESC"]]
        });

        // let reviews = [];
        // if (productData && productData.product_variants) {
        //     productData.product_variants.forEach(variant => {
        //         if (variant.order_details) {
        //             variant.order_details.forEach(od => {
        //                 if (od.reviews) {
        //                     reviews = reviews.concat(od.reviews);
        //                 }
        //             });
        //         }
        //     });
        // }



        // Thống kê

        const totalReviews = reviews.length;
        const averageRating = totalReviews
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
            : 0;

        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1);

        return { reviews, statistics: { totalReviews, averageRating, ratingCounts } };
    }



    async getAdminComments({ page, limit, rating, status, search }) {
        const whereReview = {};
        const whereUser = {};
        const whereOrderDetail = {};

        switch (rating) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                whereReview.rating = Number(rating);
                break;
            default:
                break;
        }


        switch (status) {
            case 'hidden':
                whereReview.is_active = true;
                break;
            case 'visible':
                whereReview.is_active = false;
                break;
            default:
                break;
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await review.findAndCountAll({
            where: whereReview,
            include: [
                {
                    model: order_detail,
                    required: true,
                    where: search ? whereOrderDetail : undefined,
                    attributes: ['id', 'name', 'image'],
                    include: [
                        {
                            model: order,
                            required: true,
                            attributes: ['id'],
                            include: [
                                {
                                    model: user,
                                    attributes: ['id', 'name'],
                                    where: search ? whereUser : undefined
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const ratings = await review.findAll({
            attributes: ['rating'],
            raw: true
        });

        const total = ratings.length;
        const average = total
            ? (ratings.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
            : 0;

        const ratingCounts = {
            5: ratings.filter(r => r.rating === 5).length,
            4: ratings.filter(r => r.rating === 4).length,
            3: ratings.filter(r => r.rating === 3).length,
            2: ratings.filter(r => r.rating === 2).length,
            1: ratings.filter(r => r.rating === 1).length
        };

        return {
            reviews: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            },
            statistics: {
                total,
                average,
                ratingCounts
            }
        };
    }

    async getAdminCommentDetail(id) {
        return await review.findByPk(id, {
            include: [
                {
                    model: order_detail,
                    attributes: ['id', 'name', 'image'],
                    include: [
                        {
                            model: order,
                            attributes: ['id', 'created_at'],
                            include: [
                                {
                                    model: user,
                                    attributes: ['id', 'name', 'email']
                                }
                            ]
                        },
                        {
                            model: product_variants,
                            attributes: ['id'],
                            include: [
                                {
                                    model: product,
                                    attributes: ['id', 'name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }

    async deleteComment(id) {
        await review.destroy({ where: { id } });
    }

    async toggleVisibility(id) {
        const cmt = await review.findByPk(id);
        if (!cmt) throw new Error('Không tìm thấy bình luận');

        // đảo trạng thái
        cmt.is_active = !cmt.is_active;
        await cmt.save();
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

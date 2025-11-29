const { banner, product, product_variants, product_image, category, post_model, discount } = require('../../models');


class siteController {
    async home(req, res) {
        try {
            const banners = await banner.findAll();
            const categories = await category.findAll(
                {
                    attributes: ['id', 'name', 'parent_id'],
                    where: { parent_id: null },
                }
            );
            const products_dog = await product.findAll({
                where: { is_deleted: false },
                include: [
                    {
                        model: discount,
                        attributes: ['discount_value', 'discount_type'],
                        through: { attributes: [] }
                    },
                    {
                        model: product_variants,
                        separate: true,
                        limit: 1,
                        order: [['price', 'ASC']],
                        include: [
                            {
                                model: product_image,
                                attributes: ['image']
                            }
                        ]
                    },
                    {
                        model: category,
                        attributes: ['parent_id'],
                        where: { parent_id: 1 },
                    }
                ],
                limit: 8,
            });

            const products_cat = await product.findAll({
                where: { is_deleted: false },
                include: [
                    {
                        model: discount,
                        attributes: ['discount_value', 'discount_type'],
                        through: { attributes: [] },
                    },
                    {
                        model: product_variants,
                        separate: true,
                        limit: 1,
                        order: [['price', 'ASC']],
                        include: [
                            {
                                model: product_image,
                                attributes: ['image'],
                            }
                        ]
                    },
                    {
                        model: category,
                        attributes: ['parent_id'],
                        where: { parent_id: 2 },
                    }
                ],
                limit: 8
            });


            const products_discount = await product.findAll({
                where: { is_deleted: false },
                include: [
                    {
                        model: discount,
                        attributes: ['discount_value', 'discount_type',],
                        through: { attributes: [] },
                        where: {
                            is_active: true,
                        },
                    },
                    {
                        model: product_variants,
                        separate: true,
                        limit: 1,
                        order: [['price', 'ASC']],
                        include: [
                            {
                                model: product_image,
                                attributes: ['image']
                            }
                        ]
                    },
                ],
                limit: 8,
            });

            const products_new = await product.findAll({
                where: { is_deleted: false },
                include: [
                    {
                        model: discount,
                        attributes: ['discount_type', 'discount_value'],
                        through: { attributes: [] },
                    }, {
                        model: product_variants,
                        separate: true,
                        limit: 1,
                        order: [['price', 'ASC']],
                        include: [
                            {
                                model: product_image,
                                attributes: ['image']
                            }
                        ]
                    },
                ],
                where: {
                    is_active: true,
                    is_hot: 1,
                }, limit: 8,

            })

            const posts = await post_model.findAll({ limit: 3 });

            res.status(200).json({
                message: "dữ liệu trang chủ",
                banners,
                categories,
                products_dog,
                products_cat,
                products_discount,
                products_new,
                posts,
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // Ví dụ: Trong file emailController.js (hoặc siteController.js)

    async handleContactForm(req, res) {
        try {
            const { name, email, message } = req.body;

            // BẮT ĐẦU logic xử lý Form Liên Hệ

            // 1. Kiểm tra dữ liệu đầu vào
            if (!name || !email || !message) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng điền đầy đủ thông tin." });
            }

            // 2. Gửi email thông báo cho Admin
            await emailService.sendContactNotificationToAdmin({
                name,
                email,
                message,
            });

            // 3. Gửi email phản hồi tự động cho người dùng
            await emailService.sendContactReply(email, name);

            // 4. Trả lời thành công
            res.status(200).json({ message: "Gửi liên hệ thành công! Cảm ơn bạn." });

        } catch (error) {
            console.error("Lỗi khi xử lý form liên hệ:", error);
            res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
        }
    }

    async handleContactForm(req, res) {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({
                    message: "Vui lòng điền đầy đủ thông tin."
                });
            }

            console.log(">>> Đang xử lý form liên hệ...");

            // Gửi mail thông báo đến admin
            await emailService.sendContactNotificationToAdmin({
                name,
                email,
                message,
            });

            // Gửi mail phản hồi cho khách
            await emailService.sendContactReply(email, name);

            return res.status(200).json({
                message: "Gửi liên hệ thành công! Cảm ơn bạn."
            });

        } catch (error) {
            console.error("Lỗi xử lý form liên hệ:", error);
            return res.status(500).json({
                message: "Có lỗi xảy ra, vui lòng thử lại."
            });
        }
    }

}

module.exports = new siteController;
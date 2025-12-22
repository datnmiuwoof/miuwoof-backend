const Joi = require("joi");
const { banner, product, product_variants, product_image, category, post_model, discount } = require('../../models');
const emailService = require('../../services/emailService')


class siteController {
    async home(req, res) {
        try {
            const categories = await category.findAll({
                attributes: ['id', 'name', 'parent_id'],
                where: {
                    is_deleted: false,
                }
            });
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

    async handleContactForm(req, res) {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng điền đầy đủ thông tin." });
            }

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


            // Gửi mail thông báo đến admin
            await emailService.sendContactNotificationToAdmin({
                name,
                email,
                message,
            });

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

    async getBanner(req, res) {
        const banners = await banner.findAll({
            where: { is_active: true },
            attributes: ['id', 'image']
        });

        res.status(200).json(banners)
    }

    async submitContact(req, res) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": "Vui lòng nhập tên",
                "any.required": "Tên là bắt buộc",
            }),
            email: Joi.string().email().required().messages({
                "string.email": "Email không hợp lệ",
                "any.required": "Email là bắt buộc",
            }),
            phone: Joi.string().allow("").optional(),
            message: Joi.string().required().messages({
                "string.empty": "Vui lòng nhập nội dung liên hệ",
                "any.required": "Nội dung là bắt buộc",
            }),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        try {
            // Gửi cả 2 email cùng lúc
            await emailService.sendContactEmails(value);

            return res.status(200).json({
                message: "Gửi liên hệ thành công! Chúng tôi sẽ phản hồi bạn sớm nhất.",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau." });
        }
    }
}

module.exports = new siteController;
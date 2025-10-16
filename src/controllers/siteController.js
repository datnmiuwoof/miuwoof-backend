const { banner, product, category, post_model, discount } = require('../models');


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
                include: [
                    {
                        model: discount,
                        attributes: ['discount_value', 'discount_type'],
                        through: { attributes: [] }
                    }
                ],
                where: { category_id: 1 }, limit: 8
            });
            const products_cat = await product.findAll({
                include: [
                    {
                        model: discount,
                        attributes: ['discount_value', 'discount_type'],
                        through: { attributes: [] }
                    }
                ],
                where: { category_id: 2 }, limit: 8
            });
            const products_discount = await product.findAll({
                include: [
                    {
                        model: discount,
                        attributes: ['discount_value', 'discount_type',],
                        through: { attributes: [] },
                        where: {
                            is_active: true,
                            // start_date: { [Op.lte]: new Date() },
                            // end_date: { [Op.gte]: new Date() },
                        },
                    },
                ],
                limit: 8,
            });

            const products_new = await product.findAll({
                include: [
                    {
                        model: discount,
                        attributes: ['discount_type', 'discount_value'],
                        through: { attributes: [] },
                    }
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
}

module.exports = new siteController;
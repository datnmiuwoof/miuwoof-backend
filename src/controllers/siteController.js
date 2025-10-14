const { banner, product, category, post_model } = require('../models');

class siteController {
    async home(req, res) {
        try {
            const banners = await banner.findAll();
            const categories = await category.findAll();
            const products_dog = await product.findAll({ where: { category_id: 1 }, limit: 8 });
            const products_cat = await product.findAll({ where: { category_id: 2 }, limit: 8 });
            const posts = await post_model.findAll({ limit: 3 });

            res.status(200).json({
                message: "dữ liệu trang chủ",
                banners,
                categories,
                products_dog,
                products_cat,
                posts,
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new siteController;
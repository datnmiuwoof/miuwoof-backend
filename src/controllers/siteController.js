const { banner, product, category, post_model } = require('../models');

class siteController {
    async home(req, res) {
        try {
            const banners = await banner.findAll();
            const categories = await category.findAll();
            const products = await product.findAll({ limit: 8 });
            const posts = await post_model.findAll({ limit: 3 });

            res.status(200).json({
                message: "dữ liệu trang chủ",
                banners,
                categories,
                products,
                posts,
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new siteController;
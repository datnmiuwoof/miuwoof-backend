// src/controllers/productController.js
const productService = require("../../services/productService");

class ProductController {

    // Lấy tất cả sản phẩm
    // async getAllProducts(req, res) {
    //     try {

    //         const allproduct = await productService.getAllProducts();
    //         res
    //             .status(200)
    //             .json(allproduct);
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }

    // }

    async getAllProducts(req, res) {

        try {
            const { search } = req.query;
            let products = await productService.searchProducts(search);

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //lấy sản phẩm theo loại
    async getCollections(req, res) {
        // console.log(req.query.limit)
        try {
            const limit = parseInt(req.query.limit, 10) || 8;
            const { slug } = req.params;
            const allcollections = await productService.getCollections({ slug, limit });
            res.status(200).json(allcollections);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDiscount(req, res) {
        try {
            const limit = parseInt(req.query.limit, 10) || 8;
            const allDiscount = await productService.getAllDiscount(limit);
            res.status(200).json(allDiscount);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    // ✅ Lấy chi tiết sản phẩm
    async getProductBySlug(req, res) {
        try {
            const { slug } = req.params;
            const product = await productService.getProductBySlug(slug);

            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "Không tìm thấy sản phẩm.",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Lấy thông tin sản phẩm thành công",
                data: product,
            });
        } catch (error) {
            console.error("Lỗi getProductById:", error);
            res.status(500).json({
                status: "error",
                message: "Lỗi hệ thống.",
            });
        }
    }

    // lấy sản phẩm tương tự
    async related(req, res) {
        try {
            const { categoryId, productId } = req.params;

            if (!categoryId) return res.status(400).json({ message: "không tìm thấy id" })

            const result = await productService.relatedProduct(categoryId, productId);

            if (!result) return res.status(400).json({ message: "không có dữ liệu" })

            res.status(200).json(result)
        } catch (error) {
            return res.status(400).json({ message: error })
        }
    }

}

module.exports = new ProductController();

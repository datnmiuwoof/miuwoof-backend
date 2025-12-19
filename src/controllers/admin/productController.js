// src/controllers/productController.js
const productService = require("../../services/productService");
const product = require('../../models/productmodel')

class ProductController {
  // Lấy tất cả sản phẩm
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const allproduct = await productService.getAllProducts(page, limit);
      res
        .status(200)
        .json(allproduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  }

  // ✅ Tạo sản phẩm mới
  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body, req.files);
      res.status(201).json({
        message: "Tạo sản phẩm thành công!",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ✅ Lấy chi tiết sản phẩm
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

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

  // ✅ Cập nhật sản phẩm
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      }

      const updatedProduct = await productService.updateProduct(
        id,
        req.body,
        req.files
      );

      res.status(200).json({
        message: "Cập nhật sản phẩm thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("❌ Lỗi tại productController.updateProduct:", error);

      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Lỗi hệ thống khi cập nhật sản phẩm.",
        error: error.message,
      });
    }
  }

  async SoftDelete(req, res) {
    try {
      const { id } = req.params;
      const is_deleted = await productService.softDelete(id);

      if (!is_deleted) {
        return res.status(400).json({ message: "khong the xoa loi logic" })
      }

      res.status(200).json({
        message: "xoa thanh cong",
        data: is_deleted,
      })
    } catch (error) {
      console.error("Lỗi getProductById:", error);
      res.status(500).json({
        status: "error",
        message: "Lỗi hệ thống.",
      });
    }
  }

  //lấy sản phẩm xóa mềm

  async getSoftDelete(req, res) {
    try {
      const getdeleted = await productService.getSoftDeleted();

      if (getdeleted) {
        return res.status(200).json({ message: "lấy sản phẩm xóa mềm thành côngg", data: getdeleted });
      }
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      // ✅ Thêm kiểm tra ID hợp lệ
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      }
      await productService.deleteProduct(id);
      res.status(200).json({ message: "Xóa sản phẩm thành công!" });
    } catch (error) {
      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Lỗi hệ thống khi xóa sản phẩm." });
    }
  }

  async toggleHot(req, res) {
    try {
      const { id } = req.params;
      const { is_hot } = req.body;

      await product.update(
        { is_hot },
        { where: { id } }
      );

      res.json({ message: "Update hot success" });
    } catch (error) {
      res.status(500).json({ message: "Update hot failed" });
    }
  }

}

module.exports = new ProductController();

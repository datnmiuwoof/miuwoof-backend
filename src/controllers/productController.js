// src/controllers/productController.js
const productService = require("../services/productService");

class ProductController {
  // Lấy tất cả sản phẩm
  async getAllProducts(req, res) {
        try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công!',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi phía server.',
      error: error.message,
    });
  }
  }

  // ✅ Tạo sản phẩm mới
  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
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
      const result = await productService.getProductById(id);
      res.status(200).json({
        message: "Lấy thông tin sản phẩm thành công!",
        data: result,
      });
    } catch (error) {
      // Phân biệt lỗi "không tìm thấy" và lỗi hệ thống
      if (error.message === "Không tìm thấy sản phẩm.") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Lỗi hệ thống." });
    }
  }

  // ✅ Cập nhật sản phẩm
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      }
      const updatedProduct = await productService.updateProduct(id, req.body);
      res.status(200).json({
        message: "Cập nhật sản phẩm thành công!",
        data: updatedProduct,
      });
    } catch (error) {
      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Lỗi hệ thống khi cập nhật sản phẩm." });
    }
  }

  // ✅ Xóa sản phẩm
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
}

module.exports = new ProductController();

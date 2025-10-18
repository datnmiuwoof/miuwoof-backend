// src/controllers/categoryController.js
const categoryService = require('../services/categoryService');

class CategoryController {

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({ message: 'Lấy danh sách danh mục thành công!', data: categories });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi hệ thống: ' + error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const result = await categoryService.getCategoryById(req.params.id);
            res.status(200).json({ message: 'Lấy thông tin danh mục thành công!', data: result });
        } catch (error) {
            if (error.message.includes('Không tìm thấy')) {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Lỗi hệ thống: ' + error.message });
        }
    }

    async createCategory(req, res) {
        try {
            const newCategory = await categoryService.createCategory(req.body);
            res.status(201).json({ message: 'Tạo danh mục thành công!', data: newCategory });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi hệ thống: ' + error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
            res.status(200).json({ message: 'Cập nhật danh mục thành công!', data: updatedCategory });
        } catch (error) {
            if (error.message.includes('Không tìm thấy')) {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Lỗi hệ thống: ' + error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.status(200).json({ message: 'Xóa danh mục thành công!' });
        } catch (error) {
            if (error.message.includes('Không tìm thấy')) {
                return res.status(404).json({ message: error.message });
            }
            // Bắt lỗi khóa ngoại khi không thể xóa danh mục có chứa sản phẩm
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ message: 'Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này.' });
            }
            res.status(500).json({ message: 'Lỗi hệ thống: ' + error.message });
        }
    }
}

module.exports = new CategoryController();
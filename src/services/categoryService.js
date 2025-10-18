// src/services/categoryService.js
const { category } = require('../models');

class CategoryService {

    async getAllCategories() {
        // Lấy tất cả danh mục cha (không có parent_id)
        // và include (lồng) các danh mục con của chúng vào
        return await category.findAll({
            where: { parent_id: null },
            include: [{
                model: category,
                as: 'children', // Alias này phải khớp với models/index.js
            }]
        });
    }

    async getCategoryById(categoryId) {
        const result = await category.findByPk(categoryId);
        if (!result) {
            throw new Error('Không tìm thấy danh mục.');
        }
        return result;
    }

    async createCategory(categoryData) {
        // Dữ liệu cần thiết: name, slug, parent_id (có thể null)
        return await category.create(categoryData);
    }

    async updateCategory(categoryId, categoryData) {
        const categoryToUpdate = await this.getCategoryById(categoryId); // Tái sử dụng hàm getById
        return await categoryToUpdate.update(categoryData);
    }

    async deleteCategory(categoryId) {
        const categoryToDelete = await this.getCategoryById(categoryId); // Tái sử dụng hàm getById
        
        
        
        await categoryToDelete.destroy();
    }
}

module.exports = new CategoryService();
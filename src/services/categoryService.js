// src/services/productService.js
// const {
//     sequelize,
//     category,
// } = require("../models");
const category = require("../models/categoryModel");

class CategoryService {

    async getAllcategory() {
        const getAllcategory = await category.findAll({
            attributes: ['id', 'name', 'slug', 'parent_id'],
        });
        return getAllcategory;
    }

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

    // tạo sản phẩm
    async createCategory(categoryData) {
        const t = await sequelize.transaction();
        try {
            const newCategory = await category.create(
                {
                    name: categoryData.name,
                    slug: categoryData.slug,
                    description: categoryData.description,
                    is_active: categoryData.is_active,
                },
                { transaction: t }
            );
            await t.commit();
            return newCategory;
        } catch (error) {
            await t.rollback();
            console.error("Lỗi service tạo sản phẩm:", error);
            throw new Error("Tạo sản phẩm thất bại.");
        }
    }

    // lấy chi tiết sản phẩm admin
    async getCategoryById(id) {
        const result = await category.findOne({
            where: { id },
        });

        if (!result) {
            throw new Error("Không tìm thấy sản phẩm.");
        }
        return result;
    }

    // lấy chi tiết sản phẩm client
    async getCategoryBySlug(slug) {
        const result = await category.findOne({
            where: { slug },
        });

        if (!result) {
            throw new Error("Không tìm thấy sản phẩm.");
        }
        return result;
    }

    // cập nhật sản phẩm
    async updateCategory(categoryId, categoryData) {
        const t = await sequelize.transaction();
        try {
            const categoryToUpdate = await category.findByPk(categoryId);
            if (!categoryToUpdate) {
                throw new Error("Không tìm thấy sản phẩm để cập nhật.");
            }

            // 1. Cập nhật thông tin chính của sản phẩm
            // ✅ Chỉ cập nhật các trường được cung cấp trong categoryData
            await categoryToUpdate.update(
                {
                    name: categoryData.name,
                    slug: categoryData.slug,
                    description: categoryData.description,
                    is_active: categoryData.is_active,
                },
                { transaction: t }
            );

            // if (categoryData.images) {
            //     await category_image.destroy(
            //         { where: { category_id: categoryId } },
            //         { transaction: t }
            //     );
            //     if (categoryData.images.length > 0) {
            //         const imagesData = categoryData.images.map((img) => ({
            //             ...img,
            //             category_id: categoryId,
            //             image: img.url,
            //         }));
            //         await category_image.bulkCreate(imagesData, { transaction: t });
            //     }
            // }

            await t.commit();

            // Trả về dữ liệu đã được cập nhật đầy đủ
            return await category.findByPk(categoryId, {
                include: [category],
            });
        } catch (error) {
            await t.rollback();
            console.error("Lỗi service cập nhật sản phẩm:", error);
            throw new Error("Cập nhật sản phẩm thất bại.");
        }
    }

    // xóa sản phẩm
    async deleteCategory(categoryId) {
        const categoryToDelete = await category.findByPk(categoryId);
        if (!categoryToDelete) {
            throw new Error("Không tìm thấy sản phẩm để xóa.");
        }

        await categoryToDelete.destroy();
    }
    // ...
}

module.exports = new CategoryService();



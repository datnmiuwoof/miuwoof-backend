// src/services/productService.js
const {
    sequelize,
} = require("../models");

const productVariants = require("../models/productVariants");
const product_category = require("../models/productCategoryModel")
const { product } = require("../models")
const category = require("../models/categoryModel");

class CategoryService {

    // dữ liệu của menu client
    async getAllcategory() {
        const getAllcategory = await category.findAll({
            attributes: ['id', 'name', 'slug', 'parent_id'],
        });
        return getAllcategory;
    }

    async getAllCategories() {
        return await category.findAll({
            where: { parent_id: null },
            include: [{
                model: category,
                as: 'children',
            }]
        });
    }

    // lấy dữ liệu cho admin
    async getAllCategoryAdmin() {
        try {
            const categories = await category.findAll({
                include: [
                    {
                        model: product,
                        attributes: ["id"],
                        as: 'Products',
                        through: { attributes: [] },
                        include: [
                            {
                                model: productVariants,
                                attributes: ["available_quantity"]
                            }
                        ]
                    }
                ]
            });

            return categories;
        } catch (error) {
            console.error('Lỗi:', error);
            return [];
        }
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
    async getCategoryDetail(id) {
        const categoryDetail = await category.findOne({
            where: { id },
            include: [{ model: category, as: "parent" }]
        });

        if (!categoryDetail) throw new Error("Không tìm thấy category");

        const allCategories = await category.findAll({
            where: { parent_id: null },
            attributes: ["id", "name", "parent_id"]
        });

        return { category: categoryDetail, allCategories };
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

            const categoryUpdate = await categoryToUpdate.update(
                {
                    name: categoryData.name,
                    slug: categoryData.slug,
                    description: categoryData.description,
                    is_active: categoryData.is_active,
                    parent_id: categoryData.parent_id || null,
                },
                { transaction: t }
            );

            await t.commit();

            return categoryUpdate
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



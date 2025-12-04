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
            where: { is_deleted: false },
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
                where: { is_deleted: false },
                include: [
                    {
                        model: product,
                        attributes: ["id"],
                        as: 'Products',
                        through: { attributes: [] },
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
                    parent_id: categoryData.parent_id,
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

    async softDelete(id) {
        const child = await category.findOne({
            where: { parent_id: id, is_deleted: false }
        });

        if (child) {
            throw new Error("Danh mục này đang có danh mục con. Hãy xóa hoặc chuyển danh mục con trước.");
        }

        const result = await category.update(
            {
                is_deleted: true,
                include: [
                    { model: product }
                ]
            },
            { where: { id } }
        );

        return result;
    }

    //khôi phục danh mục
    async restoreCaegory(id) {
        try {
            const dataCategory = await category.findByPk(id);
            if (!dataCategory) return ({ success: false, message: 'Không tìm thấy danh mục' });

            if (!dataCategory.is_deleted) {
                return ({ success: false, message: 'Danh mục này chưa bị xóa.' });
            }

            dataCategory.is_deleted = false;
            await dataCategory.save();

            return ({ success: true, message: 'Khôi phục danh mục thành công', dataCategory });
        } catch (error) {
            return error
        }

    }

    async getSoftDeleted() {
        try {
            const data = await category.findAll({
                where: { is_deleted: true },
                include: [
                    {
                        model: product,
                        attributes: ["id"],
                        as: 'Products',
                        through: { attributes: [] },
                    }
                ]
            });

            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                message: "Lỗi khi lấy danh mục đã xóa",
                error: error.message
            };
        }
    }


}

module.exports = new CategoryService();



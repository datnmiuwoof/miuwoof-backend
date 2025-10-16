const { category } = require("../models");
const slugify = require("slugify");

class CategoryController {
    // Lấy tất cả category
    async getAll(req, res) {
        try {
            const categories = await category.findAll(
                {
                    attributes: ['id', 'name', 'parent_id'],
                    where: { parent_id: null },
                }
            );
            res.status(200).json({
                message: "Lấy danh sách category thành công",
                data: categories,
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi lấy dữ liệu",
                error: error.message,
            });
        }
    }

    // Tạo mới category
    async create(req, res) {
        try {
            const { name, description } = req.body;

            const createcategory = await category.create({ name, description });

            res.status(201).json({
                message: "Thêm category thành công",
                data: createcategory,
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi thêm dữ liệu",
                error: error.message,
            });
        }
    }

    async desstroy(req, res) {
        try {
            const { slug } = req.params;

            if (!slug) return res.status(400).json({ message: 'slug không tồn tại' })
            const dlecategory = await category.destroy({ where: { slug } });
            res.status(201).json({
                message: "xóa category thành công",
                data: dlecategory,
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi xóa dữ liệu",
                error: error.message,
            });
        }

    }

    async update(req, res) {
        try {
            const { slug } = req.params;
            const { name, description } = req.body;

            // Kiểm tra slug có được truyền không
            if (!slug) {
                return res.status(400).json({ message: "Slug không tồn tại" });
            }

            // Tìm category theo slug
            const Category = await category.findOne({ where: { slug } });
            if (!Category) {
                return res.status(404).json({ message: "Không tìm thấy category với slug này" });
            }

            // Nếu có name mới, tạo lại slug
            const newSlug = name ? slugify(name, { lower: true }) : slug;

            // Cập nhật dữ liệu
            await Category.update(
                { name, description, slug: newSlug },
                { where: { slug } }
            );

            // Lấy lại dữ liệu sau khi update (nếu muốn trả về)
            const updated = await category.findOne({ where: { slug: newSlug } });

            res.status(200).json({
                message: "Cập nhật category thành công",
                data: updated,
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi update dữ liệu",
                error: error.message,
            });
        }
    }
}

module.exports = new CategoryController();

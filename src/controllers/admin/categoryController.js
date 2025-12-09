const categoryService = require("../../services/categoryService");
const slugify = require("slugify");

class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await categoryService.getAllCategoryAdmin();
            res.status(200).json({
                message: "Lấy danh sách category thành công",
                data: categories,
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi lấy dữ liệu getall",
                error: error.message,
            });
        }
    }

    //lấy mố sản phẩm show giao diện
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const result = await categoryService.getCategoryDetail(id);

            res.status(200).json({ data: result })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    // Tạo mới category
    async create(req, res) {
        try {
            const { name, description, is_active, parent_id } = req.body;

            const slug = slugify(name, { lower: true, strict: true });

            const createCategory = await categoryService.createCategory({
                name,
                slug,
                description,
                is_active,
                parent_id,
            });

            res.status(201).json({
                message: "Thêm category thành công",
                data: createCategory,
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi thêm dữ liệu",
                error: error.message,
            });
        }
    }

    // Xóa category
    async destroy(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID không tồn tại" });

            await categoryService.deleteCategory(id);
            res.status(200).json({
                message: "Xóa category thành công",
            });
        } catch (error) {
            res.status(500).json({
                message: "Lỗi khi xóa dữ liệu",
                error: error.message,
            });
        }
    }

    // Cập nhật category
    async updateCategory(req, res) {
        try {
            const { name, description, is_active, parent_id } = req.body;
            const { id } = req.params;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: "ID không hợp lệ." });
            }

            const slug = slugify(name, { lower: true, strict: true });

            const updatedCategory = await categoryService.updateCategory(id, {
                name,
                description,
                slug,
                is_active: is_active ?? true,
                parent_id: parent_id === null ? null : parent_id || null,
            });

            res.status(200).json({
                message: "Cập nhật category thành công!",
                data: updatedCategory,
            });
        } catch (error) {
            console.error("Lỗi controller cập nhật category:", error); // ← Thêm log này!
            res.status(500).json({
                message: "Lỗi hệ thống khi cập nhật category.",
                error: error.message,
            });
        }
    }

    //xóa mềm category
    async softDeleted(req, res) {
        try {
            const { id } = req.params;

            await categoryService.softDelete(id);

            return res.status(200).json({
                message: "Xóa danh mục thành công!"
            });

        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    //lấy danh mục bị xóa
    async getSoftDeleted(req, res) {
        try {
            const result = await categoryService.getSoftDeleted();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    //khôi phục xóa mềm
    async restoreCategory(req, res) {
        try {
            const { id } = req.params;
            if (!id) res.status(400).json({ message: "không tìm thấy id" });

            const result = await categoryService.restoreCaegory(id);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(400).json(error)
        }
    };



}

module.exports = new CategoryController();

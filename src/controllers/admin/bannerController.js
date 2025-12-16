// src/controllers/admin/bannerController.js
const bannerService = require("../../services/bannerService");

class BannerController {
    
    // GET ALL
    async getAll(req, res) {
        try {
            const list = await bannerService.getAllBanners();
            res.status(200).json({
                message: "Lấy danh sách banner thành công",
                data: list
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET BY ID
    async getById(req, res) {
        try {
            const data = await bannerService.getBannerById(req.params.id);
            res.status(200).json({ data });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    // CREATE
    async create(req, res) {
        try {
            const result = await bannerService.createBanner(req.body, req.file);
            res.status(201).json({
                message: "Tạo banner thành công",
                data: result
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const result = await bannerService.updateBanner(id, req.body, req.file);
            res.status(200).json({
                message: "Cập nhật banner thành công",
                data: result
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // DELETE
    async delete(req, res) {
        try {
            const { id } = req.params;
            await bannerService.deleteBanner(id);
            res.status(200).json({ message: "Xóa banner thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new BannerController();
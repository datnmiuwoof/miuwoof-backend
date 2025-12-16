// src/services/bannerService.js
const { banner } = require("../models");
const uploadService = require("./uploadService");

class BannerService {
    
    async getAllBanners() {
        return await banner.findAll({
            order: [["created_at", "DESC"]],
        });
    }

    async getBannerById(id) {
        const data = await banner.findByPk(id);
        if (!data) throw new Error("Banner không tồn tại");
        return data;
    }

    async createBanner(data, file) {
        let imageUrl = "";
        
        if (file) {
            imageUrl = await uploadService.uploadImage(file.path);
        } else {
            throw new Error("Vui lòng chọn hình ảnh cho banner");
        }

        const newBanner = await banner.create({
            title: data.title,
            image: imageUrl,
            is_active: data.is_active !== undefined ? data.is_active : true,
        });

        return newBanner;
    }

    async updateBanner(id, data, file) {
        const bannerFound = await this.getBannerById(id);

        let imageUrl = bannerFound.image;
        
        if (file) {
            imageUrl = await uploadService.uploadImage(file.path);
        }

        await bannerFound.update({
            title: data.title || bannerFound.title,
            image: imageUrl,
            is_active: data.is_active !== undefined ? data.is_active : bannerFound.is_active,
        });

        return bannerFound;
    }

    async deleteBanner(id) {
        const bannerFound = await this.getBannerById(id);
        await bannerFound.destroy();
        return true;
    }
}

module.exports = new BannerService();
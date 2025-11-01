const {
  banner,
  product,
  category,
  post_model,
  discount,
} = require("../models");
const { Op, where } = require("sequelize");
const emailService = require("../services/emailService");
class siteController {
  async home(req, res) {
    try {
      const banners = await banner.findAll();
      const categories = await category.findAll({
        attributes: ["id", "name", "parent_id"],
        where: { parent_id: null },
      });
      const products_dog = await product.findAll({
        include: [
          {
            model: discount,
            attributes: ["discount_value", "discount_type"],
            through: { attributes: [] },
          },
        ],
        where: { category_id: 1 },
        limit: 8,
      });
      const products_cat = await product.findAll({
        include: [
          {
            model: discount,
            attributes: ["discount_value", "discount_type"],
            through: { attributes: [] },
          },
        ],
        where: { category_id: 2 },
        limit: 8,
      });
      const products_discount = await product.findAll({
        include: [
          {
            model: discount,
            attributes: ["discount_value", "discount_type"],
            through: { attributes: [] },
            where: {
              is_active: true,
              // start_date: { [Op.lte]: new Date() },
              // end_date: { [Op.gte]: new Date() },
            },
          },
        ],
        limit: 8,
      });

      const products_new = await product.findAll({
        include: [
          {
            model: discount,
            attributes: ["discount_type", "discount_value"],
            through: { attributes: [] },
          },
        ],
        where: {
          is_active: true,
          is_hot: 1,
        },
        limit: 8,
      });

      const posts = await post_model.findAll({ limit: 3 });

      res.status(200).json({
        message: "dữ liệu trang chủ",
        banners,
        categories,
        products_dog,
        products_cat,
        products_discount,
        products_new,
        posts,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async handleContactForm(req, res) {
    try {
      const { name, email, message } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ message: "Vui lòng điền đầy đủ thông tin." });
      }
      console.log("--- Bắt đầu xử lý Form Liên Hệ ---");
      // 1. Gửi email thông báo cho Admin
      await emailService.sendContactNotificationToAdmin({
        name,
        email,
        message,
      });
      // 2. Gửi email phản hồi tự động cho người dùng
      await emailService.sendContactReply(email, name);
      res.status(200).json({ message: "Gửi liên hệ thành công! Cảm ơn bạn." });
    } catch (error) {
      console.error("Lỗi khi xử lý form liên hệ:", error);
      res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  }
}

module.exports = new siteController();

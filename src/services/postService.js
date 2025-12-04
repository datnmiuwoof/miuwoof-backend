// src/services/postService.js
const { post_model, post_category, user } = require("../models");
const uploadService = require("./uploadService");
const slugify = require("slugify");
const fs = require("fs");

class PostService {
  // 1. Lấy danh sách bài viết (Kèm thông tin người viết và danh mục)
  async getAllPosts() {
    return await post_model.findAll({
      include: [
        {
          model: post_category,
          attributes: ["id", "name"],
        },
        {
          model: user,
          attributes: ["id", "name", "email"], // Lấy tên và email tác giả
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // 2. Lấy chi tiết bài viết
  async getPostById(id) {
    const post = await post_model.findByPk(id, {
      include: [
        { model: post_category, attributes: ["id", "name"] },
        { model: user, attributes: ["id", "name"] },
      ],
    });

    if (!post) throw new Error("Bài viết không tồn tại");
    return post;
  }

  // 3. Tạo bài viết mới
  async createPost(data, file, userId) {
    // Xử lý upload ảnh nếu có
    let imageUrl = null;
    if (file) {
      imageUrl = await uploadService.uploadImage(file.path);
    }

    // Tạo slug từ tiêu đề
    const slug = slugify(data.title, { lower: true, strict: true });

    // Tạo bài viết trong DB
    const newPost = await post_model.create({
      title: data.title,
      slug: slug,
      content: data.content,
      image: imageUrl,
      post_category_id: data.post_category_id,
      user_id: userId, // ✅ QUAN TRỌNG: Lưu ID của Admin tạo bài
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    return newPost;
  }

  // 4. Cập nhật bài viết
  async updatePost(id, data, file) {
    const post = await this.getPostById(id);

    let imageUrl = post.image;
    if (file) {
      imageUrl = await uploadService.uploadImage(file.path);
      // TODO: Nếu muốn tiết kiệm dung lượng cloud, có thể xóa ảnh cũ tại đây
    }

    let slug = post.slug;
    if (data.title && data.title !== post.title) {
      slug = slugify(data.title, { lower: true, strict: true });
    }

    await post.update({
      title: data.title || post.title,
      slug: slug,
      content: data.content || post.content,
      post_category_id: data.post_category_id || post.post_category_id,
      image: imageUrl,
      is_active: data.is_active !== undefined ? data.is_active : post.is_active,
      // user_id thường giữ nguyên người tạo ban đầu
    });

    return post;
  }

  // 5. Xóa bài viết
  async deletePost(id) {
    const post = await this.getPostById(id);
    await post.destroy();
    return true;
  }
}

module.exports = new PostService();

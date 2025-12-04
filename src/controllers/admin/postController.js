// src/controllers/admin/postController.js
const postService = require("../../services/postService");

class PostController {
  // GET ALL
  async getAll(req, res) {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json({
        message: "Lấy danh sách bài viết thành công",
        data: posts,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET BY ID
  async getById(req, res) {
    try {
      const post = await postService.getPostById(req.params.id);
      res.status(200).json({ data: post });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // CREATE
  async create(req, res) {
    try {
      const { title, content, post_category_id } = req.body;

      // Validate cơ bản
      if (!title || !content || !post_category_id) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đủ title, content và danh mục" });
      }

      // ✅ Lấy ID Admin từ Token (nhờ authmiddlewares)
      const userId = req.user.id;

      const newPost = await postService.createPost(req.body, req.file, userId);

      res.status(201).json({
        message: "Tạo bài viết thành công",
        data: newPost,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi tạo bài viết: " + error.message });
    }
  }

  // UPDATE
  async update(req, res) {
    try {
      const updatedPost = await postService.updatePost(
        req.params.id,
        req.body,
        req.file
      );
      res.status(200).json({
        message: "Cập nhật bài viết thành công",
        data: updatedPost,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật: " + error.message });
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      await postService.deletePost(req.params.id);
      res.status(200).json({ message: "Xóa bài viết thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new PostController();

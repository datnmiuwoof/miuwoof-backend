const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const upload = require("../../middlewares/upload");
const productController = require("../../controllers/admin/productController");

// ✅ Đặt các route cụ thể lên trước
router.patch("/:id/hot", productController.toggleHot);
router.get("/deleted", authmiddlewares("admin"), productController.getSoftDelete);
router.get("/:id", authmiddlewares("admin"), productController.getProductById);
router.put("/:id", upload.any(), authmiddlewares("admin"), productController.updateProduct);
router.put("/:id/soft-delete", authmiddlewares("admin"), productController.SoftDelete);
router.delete("/:id", authmiddlewares("admin"), productController.deleteProduct);


// ✅ Cuối cùng mới đến route tổng quát
router.get("/", authmiddlewares("admin"), productController.getAllProducts);
router.post("/create", upload.any(), authmiddlewares("admin"), productController.createProduct);

module.exports = router;

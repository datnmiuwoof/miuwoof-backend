const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const upload = require("../../middlewares/upload");
const productController = require("../../controllers/admin/productController");

router.use(authmiddlewares("admin"));
// Đặt các route cụ thể lên trước
router.patch("/:id/hot", productController.toggleHot);
router.get("/deleted", productController.getSoftDelete);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.any(), productController.updateProduct);
router.put("/:id/soft-delete", productController.SoftDelete);
router.delete("/:id", productController.deleteProduct);


// ✅ Cuối cùng mới đến route tổng quát
router.get("/", productController.getAllProducts);
router.post("/create", upload.any(), productController.createProduct);

module.exports = router;

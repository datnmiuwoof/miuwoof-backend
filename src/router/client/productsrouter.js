const express = require("express");
const router = express.Router();

const productController = require("../../controllers/client/productController");


router.get("/", productController.getAllProducts);
router.get("/related/:productId/:categoryId", productController.related)
router.get("/collections/:slug", productController.getCollections);
router.get("/khuyen-mai", productController.getDiscount);
router.get("/:slug", productController.getProductBySlug);

module.exports = router;

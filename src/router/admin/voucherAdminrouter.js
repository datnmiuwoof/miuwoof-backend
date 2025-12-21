const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const voucherController = require("../../controllers/admin/voucherController");

router.post("/addVoucher", authmiddlewares("admin"), voucherController.addVoucher);
router.post("/apply", voucherController.applyDiscount)
router.get('/product-active', voucherController.getProductDiscountOptions);
router.put('/:id', authmiddlewares("admin"), voucherController.updateVoucher);
router.delete('/:id', authmiddlewares("admin"), voucherController.deleteVoucher);
router.get("/:id", authmiddlewares("admin"), voucherController.getVoucherId);
router.get("/", authmiddlewares("admin"), voucherController.getVoucher);




module.exports = router;
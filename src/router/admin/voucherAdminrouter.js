const express = require("express");
const router = express.Router();

const voucherController = require("../../controllers/admin/voucherController");

router.post("/addVoucher", voucherController.addVoucher);
router.post("/apply", voucherController.applyDiscount)
router.get('/product-active', voucherController.getProductDiscountOptions);
router.put('/:id', voucherController.updateVoucher);
router.delete('/:id', voucherController.deleteVoucher);
router.get("/:id", voucherController.getVoucherId);
router.get("/", voucherController.getVoucher);




module.exports = router;
const express = require("express");
const router = express.Router();

const ordercontroller = require("../../controllers/admin/orderController");
const authmiddlewares = require("../../middlewares/middlewares");

router.use(authmiddlewares("admin"));

router.put("/cancelled", ordercontroller.cancelledOrder);
router.put("/:id/delete", ordercontroller.softDelete);
router.get("/deleted", ordercontroller.getDeletedOrders);
router.put("/restore/:id", ordercontroller.restoreOrder);
router.post("/update", ordercontroller.updateStatusOrder);
router.get("/:id", ordercontroller.getDetailOrder);
router.get("/", ordercontroller.getAllOrder);

module.exports = router;
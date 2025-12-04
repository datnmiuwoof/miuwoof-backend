const express = require("express");
const router = express.Router();

const ordercontroller = require("../../controllers/admin/orderController");
const authmiddlewares = require("../../middlewares/middlewares");

// router.put("/cancelled", authmiddlewares("admin"), ordercontroller.cancelledOrder);
router.post("/update", authmiddlewares("admin"), ordercontroller.updateStatusOrder);
router.get("/:id", authmiddlewares("admin"), ordercontroller.getDetailOrder);
router.get("/", authmiddlewares("admin"), ordercontroller.getAllOrder);

module.exports = router;
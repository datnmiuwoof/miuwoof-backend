
const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const orderController = require("../../controllers/client/orderController")

router.get("/:status", authmiddlewares("user"), orderController.checkOrder);
router.get("/detail/:id", authmiddlewares("user"), orderController.orderDetail);


module.exports = router;
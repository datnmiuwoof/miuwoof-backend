const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");

const orderController = require("../../controllers/client/orderController");
router.put("/cancel/:id", authmiddlewares("user"), orderController.cancelOrder);

router.post("/", authmiddlewares("user"), orderController.createOrder);

module.exports = router;
const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");

const momoController = require("../../controllers/client/momoController");

router.post("/notify", momoController.handleWebhook);
router.get("/status/:orderId", momoController.getOrderStatus);
router.post("/", authmiddlewares("user"), momoController.createOrderMoMo);

module.exports = router;
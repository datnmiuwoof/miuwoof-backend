const express = require("express");
const router = express.Router();

const authmiddlewares = require("../../middlewares/middlewares");
const CartController = require("../../controllers/client/cartController");




router.get("/", authmiddlewares("user"), CartController.getCart);
router.post("/add", authmiddlewares("user"), CartController.addItem);
router.patch("/update/:id", authmiddlewares("user"), CartController.updateItem);
router.delete("/remove/:id", authmiddlewares("user"), CartController.removeItem);
router.post("/sync", authmiddlewares("user"), CartController.syncCart);

module.exports = router;

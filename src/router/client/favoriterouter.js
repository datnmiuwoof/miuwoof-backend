
const express = require("express");
const router = express.Router();
const favoriteController = require("../../controllers/client/favoriteController");
const authmiddlewares = require("../../middlewares/middlewares"); // Middleware kiểm tra đăng nhập

router.use(authmiddlewares("user")); 

router.post("/toggle", favoriteController.toggle);

router.get("/", favoriteController.getList);

module.exports = router;
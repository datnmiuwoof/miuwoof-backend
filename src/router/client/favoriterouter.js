
const express = require("express");
const router = express.Router();
const favoriteController = require("../../controllers/client/favoriteController");
const authmiddlewares = require("../../middlewares/middlewares");

router.use(authmiddlewares("user"));

router.post("/toggle", favoriteController.toggle);

router.get("/", authmiddlewares("user"), favoriteController.getList);

module.exports = router;
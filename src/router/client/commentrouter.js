const express = require("express");
const router = express.Router();
const commentController = require("../../controllers/client/commentController");
const authmiddlewares = require("../../middlewares/middlewares");

router.post("/create", authmiddlewares('user'), commentController.create);

module.exports = router;
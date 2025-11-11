const express = require("express");
const router = express.Router();

const userController = require("../../controllers/admin/userController");

router.get("/", userController.getAllUser);


module.exports = router;
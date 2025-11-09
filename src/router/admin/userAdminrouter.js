const express = require("express");
const router = express.Router();

const userController = require("../../controllers/admin/userController");

router.get("/", userController.getAllUser);
router.post("/login", userController.login);
router.post("/register", userController.addUser);


module.exports = router;
const express = require("express");
const router = express.Router();

const userController = require("../../controllers/client/userCotroller");

router.post("/login", userController.login);
router.post("/register", userController.addUser);


module.exports = router;
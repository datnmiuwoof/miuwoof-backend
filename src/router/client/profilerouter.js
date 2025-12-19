
const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const profileController = require("../../controllers/client/profileController");

router.post("/add", authmiddlewares("user"), profileController.addAddress);
router.put("/update", authmiddlewares("user"), profileController.updateProfile)
router.get("/", authmiddlewares("user"), profileController.getProfile);


module.exports = router;
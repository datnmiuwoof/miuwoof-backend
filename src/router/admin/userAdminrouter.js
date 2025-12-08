const express = require("express");
const router = express.Router();

const userController = require("../../controllers/admin/userController");

// router.get("is_locket", userController.isLocket)
router.get("/status/:id", userController.getStatusUser);
router.put("/block/:id", userController.blockUser)
router.get("/:id", userController.getDetailUser);
router.get("/", userController.getAllUser);


module.exports = router;
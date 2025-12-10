const express = require("express");
const router = express.Router();

const userController = require("../../controllers/admin/userController");
const authmiddlewares = require("../../middlewares/middlewares");

// router.get("is_locket", userController.isLocket)
router.get("/status/:id", userController.getStatusUser);
router.get("/:id", userController.getDetailUser);
router.get("/", userController.getAllUser);
router.put("/toggle-lock/:id", authmiddlewares("admin"), userController.toggleLock);
router.put("/change-role/:id", authmiddlewares("admin"), userController.changeRole);


module.exports = router;
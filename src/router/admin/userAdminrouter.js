const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const userController = require("../../controllers/admin/userController");


router.use(authmiddlewares("admin"));
router.get("/is_locked", userController.isLocked);
router.get("/status/:id", userController.getStatusUser);
router.put("/block/:id", userController.blockUser);
router.put("/:id/unban", userController.unbanUser);
router.get("/:id", userController.getDetailUser);
router.get("/", userController.getAllUser);


module.exports = router;
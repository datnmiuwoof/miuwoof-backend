const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const userController = require("../../controllers/client/userCotroller");



router.post("/register/verify-otp", userController.verifyOtp);
router.post("/register", userController.sendOtp);
router.post("/login", userController.login);

router.get("/me", authmiddlewares(), userController.getCurrentUser);
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
})

router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", authmiddlewares(), userController.changePassword);
module.exports = router;
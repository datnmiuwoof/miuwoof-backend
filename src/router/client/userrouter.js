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



module.exports = router;
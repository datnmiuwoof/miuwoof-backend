const express = require("express");
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const userController = require("../../controllers/client/userCotroller");
const passport = require("passport");



router.post("/register/verify-otp", userController.verifyOtp);
router.post("/register", userController.sendOtp);
router.post("/login", userController.login);
router.post("/forgot-password", userController.sendForgotPasswordOtp);
router.post("/reset/verify-otp", userController.passwordReset);
router.put("/change-password", authmiddlewares(), userController.resetPassword);
router.get("/me", authmiddlewares(), userController.getCurrentUser);
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
});

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login-fail" }),
    userController.googleCallback
);


module.exports = router;
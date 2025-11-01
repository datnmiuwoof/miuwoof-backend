const express = require("express");
const router = express.Router();

const siteController = require("../controllers/sitecontroller");

router.get("/", siteController.home);
router.post("/contact", siteController.handleContactForm);
module.exports = router;

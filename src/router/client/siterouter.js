const express = require("express");
const router = express.Router();

const siteController = require('../../controllers/client/siteController')

router.post("/contact", siteController.handleContactForm);
router.get('/banner', siteController.getBanner);
router.get("/", siteController.home);
module.exports = router;

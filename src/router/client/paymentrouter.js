const express = require("express");
const router = express.Router();

const codrouter = require("./orderrouter");
const momorouter = require("./momorouter");
const statusrouter = require("./statusrouter");
const checkOrder = require("./orderCheckOrder")

router.use("/cod", codrouter);
router.use("/momo", momorouter);
router.use("/status", statusrouter);
router.use("/check", checkOrder);


module.exports = router;
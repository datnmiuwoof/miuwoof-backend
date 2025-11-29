const express = require("express");
const router = express.Router();

// const authmiddlewares = require("../../middlewares/middlewares");
const codrouter = require("./orderrouter");
const momorouter = require("./momorouter");
const statusrouter = require("./statusrouter");

router.use("/cod", codrouter);
router.use("/momo", momorouter);
router.use("/status", statusrouter)


module.exports = router;
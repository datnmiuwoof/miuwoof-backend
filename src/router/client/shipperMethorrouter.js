const express = require("express");
const router = express.Router();

const shipperMethodController = require('../../controllers/client/shipperMethodController')

router.get("/", shipperMethodController.getShippingMethods);
module.exports = router;

const express = require("express");
const router = express.Router();

const addressController = require("../../controllers/client/addressController");

router.get("/:id", addressController.checkoutAddress);
// router.get("/", addressController.getAddresses);
// router.patch("/:id", addressController.updateAddress);
// router.delete("/:id", addressController.deleteAddress);

module.exports = router;
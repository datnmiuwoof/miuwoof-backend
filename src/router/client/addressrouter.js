const express = require("express");
const router = express.Router();

const authmiddlewares = require("../../middlewares/middlewares");
const addressController = require("../../controllers/client/addressController");

router.get("/", authmiddlewares("user"), addressController.checkoutAddress);
router.patch("/:id/set-default", authmiddlewares("user"), addressController.setDefaultAddress);
// router.get("/", addressController.getAddresses);
// router.patch("/:id", addressController.updateAddress);
// router.delete("/:id", addressController.deleteAddress);

module.exports = router;
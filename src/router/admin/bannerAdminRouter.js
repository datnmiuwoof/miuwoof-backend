
const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/admin/bannerController");
const upload = require("../../middlewares/upload"); 
const authmiddlewares = require("../../middlewares/middlewares");

router.use(authmiddlewares("admin"));

router.get("/", bannerController.getAll);
router.get("/:id", bannerController.getById);

router.post("/create", upload.single("image"), bannerController.create);
router.put("/:id", upload.single("image"), bannerController.update);
router.delete("/:id", bannerController.delete);

module.exports = router;
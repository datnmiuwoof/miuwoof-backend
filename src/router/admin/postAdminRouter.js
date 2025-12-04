const express = require("express");
const router = express.Router();
const postController = require("../../controllers/admin/postController");
const upload = require("../../middlewares/upload");
const authmiddlewares = require("../../middlewares/middlewares");

router.get("/", authmiddlewares("admin"), postController.getAll);
router.get("/:id", authmiddlewares("admin"), postController.getById);

router.post(
  "/create",
  authmiddlewares("admin"),
  upload.single("image"),
  postController.create
);
router.put(
  "/:id",
  authmiddlewares("admin"),
  upload.single("image"),
  postController.update
);
router.delete("/:id", authmiddlewares("admin"), postController.delete);

module.exports = router;

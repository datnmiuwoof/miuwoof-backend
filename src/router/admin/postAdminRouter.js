const express = require("express");
const router = express.Router();
const postController = require("../../controllers/admin/postController");
const upload = require("../../middlewares/upload");
const authmiddlewares = require("../../middlewares/middlewares");

router.use(authmiddlewares("admin"));

router.get("/", postController.getAll);
router.get("/:id", postController.getById);

router.post(
  "/create",
  upload.single("image"),
  postController.create
);
router.put(
  "/:id",
  upload.single("image"),
  postController.update
);
router.delete("/:id", postController.delete);

module.exports = router;

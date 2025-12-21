const express = require('express');
const router = express.Router();
const CommentController = require('../../controllers/admin/commentController');
const authmiddlewares = require("../../middlewares/middlewares");

router.use(authmiddlewares("admin"));
router.get('/', CommentController.getAll);
router.get('/:id', CommentController.getDetail);
router.put('/:id/toggle', CommentController.toggleVisibility);
router.delete('/:id', CommentController.remove);

module.exports = router;

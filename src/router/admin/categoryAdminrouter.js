const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/admin/categoryController');

router.get('/', categoryController.getAll);
router.post('/create', categoryController.create);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.destroy);



module.exports = router;
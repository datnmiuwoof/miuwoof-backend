const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/admin/categoryController');


router.post('/create', categoryController.create);
router.get('/:id', categoryController.getOne);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.destroy);
router.get('/', categoryController.getAll);


module.exports = router;
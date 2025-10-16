const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAll);
router.post('/', categoryController.create);
router.put('/:slug', categoryController.update);
router.delete('/:slug', categoryController.desstroy);



module.exports = router;
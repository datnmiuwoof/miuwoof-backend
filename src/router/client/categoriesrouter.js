const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/client/categoryController');

router.get('/', categoryController.getAll);




module.exports = router;
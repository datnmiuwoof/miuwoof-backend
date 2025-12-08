const express = require('express');
const router = express.Router();

const DashboardController = require('../../controllers/admin/DashboardController');

router.get('/', DashboardController.overview);


module.exports = router;
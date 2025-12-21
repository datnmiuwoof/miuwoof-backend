const express = require('express');
const router = express.Router();
const authmiddlewares = require("../../middlewares/middlewares");
const DashboardController = require('../../controllers/admin/DashboardController');

router.use(authmiddlewares("admin"));
router.get('/', DashboardController.overview);


module.exports = router;
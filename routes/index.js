const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const menuController = require('../controllers/menuController');
const orderController = require('../controllers/orderController');

router.get('/', homeController.getHome);
router.get('/about', aboutController.getAbout);
router.get('/restaurants/:id/menu', menuController.getMenuByRestaurant);

router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrder);
router.post('/orders/:id/update', orderController.updateOrder);
router.post('/orders/:id/cancel', orderController.cancelOrder);

module.exports = router;
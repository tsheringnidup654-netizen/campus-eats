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

module.exports = router;
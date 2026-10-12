const express = require('express');

const router = express.Router();

const apiController = require('../controllers/apiController');
const { requireAuthApi } = require('../middleware/auth');

router.get('/restaurants', apiController.getRestaurants);

router.get(
    '/restaurants/:id/menu',
    apiController.getRestaurantMenu
);

router.get(
    '/orders/:id',
    apiController.getOrder
);

router.post('/orders', requireAuthApi, apiController.createOrder);

router.get(
    '/stats',
    apiController.getStats
);

module.exports = router;
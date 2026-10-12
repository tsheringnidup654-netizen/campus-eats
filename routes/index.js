const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const menuController = require('../controllers/menuController');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const superAdminController = require('../controllers/superAdminController');
const {
    requireAuth,
    requireAdmin,
    requireSuperAdmin
} = require('../middleware/auth');
const { connectMongo } = require('../config/mongo');
const feedbackController =require('../controllers/feedbackController');

router.get('/superadmin/dashboard', requireSuperAdmin, superAdminController.dashboard);
router.post('/superadmin/restaurants', requireSuperAdmin, superAdminController.addRestaurant);
router.post('/superadmin/restaurants/:id/remove', requireSuperAdmin, superAdminController.removeRestaurant);
router.post('/superadmin/grant-admin', requireSuperAdmin, superAdminController.grantAdmin);

router.get('/admin/dashboard', requireAdmin, adminController.dashboard);
router.post('/admin/menu', requireAdmin, adminController.addMenuItem);


router.get('/', homeController.getHome);
router.get('/about', aboutController.getAbout);
router.get('/restaurants/:id/menu', menuController.getMenuByRestaurant);

router.post('/orders', requireAuth, orderController.createOrder);
router.get('/orders/:id', orderController.getOrder);
router.post('/orders/:id/update', orderController.updateOrder);
router.post('/orders/:id/cancel', orderController.cancelOrder);
router.get('/verify/:token', authController.verifyEmail);
router.get('/signup', authController.showSignup);
router.post('/signup', authController.signup);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/forgot-password', authController.showForgotPassword);
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password/:token', authController.showResetPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/mongo-test', async (req, res) => {
    try {
        const db = await connectMongo();
        const collections = await db.listCollections().toArray();

        res.json({
            connected: true,
            collections
        });
    } catch (error) {
        console.error('MongoDB test failed:', error);

        res.status(500).json({
            connected: false,
            error: 'MongoDB connection failed'
        });
    }
});
router.post('/restaurants/:id/feedback',feedbackController.submitFeedback);


module.exports = router;
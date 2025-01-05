var express = require('express');
var router = express.Router();


// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');
const profileController = require('../components/profile/profile-controller');
const orderController = require('../components/order/order-controller');
const reportController = require('../components/report/report-controller');

// middleware
const { isAuthenticated } = require('../components/auth/middleware');

router.get('/', isAuthenticated,profileController.getProfilePage)
router.get('/accounts', isAuthenticated,accountController.getAccountPage);

router.get('/products',isAuthenticated, productController.getProductPage);
router.get('/create',isAuthenticated, productController.getCreateProductPage);
router.get('/createBrandCategory',isAuthenticated, productController.getCreateBrandCategoryPage);

router.get('/profile',isAuthenticated, profileController.getProfilePage);

router.get('/orders',isAuthenticated, orderController.getOrderPage);
router.get('/log-in', accountController.getLogInPage);
router.get('/report',isAuthenticated, reportController.getReportPage);

module.exports = router;

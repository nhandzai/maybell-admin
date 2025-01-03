var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');
const profileController = require('../components/profile/profile-controller');
const orderController = require('../components/order/order-controller');

router.get('/', profileController.getProfilePage)
router.get('/accounts', accountController.getAccountPage);

router.get('/products', productController.getProductPage);
router.get('/create', productController.getCreateProductPage);
router.get('/createBrandCategory', productController.getCreateBrandCategoryPage);

router.get('/profile', profileController.getProfilePage);

router.get('/orders', orderController.getOrderPage);

module.exports = router;

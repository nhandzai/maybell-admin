var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');
const profileController = require('../components/profile/profile-controller');

router.get('/', profileController.getProfilePage)
router.get('/accounts', accountController.getAccountPage);
router.get('/products', productController.getProductPage);
router.get('/profile', profileController.getProfilePage);

module.exports = router;

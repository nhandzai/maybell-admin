var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');
const profileController = require('../components/profile/profile-controller');

router.get('/accounts', accountController.getAccountPageAPI);
router.post('/banAccount', accountController.banAccount);
router.get('/accountDetail', accountController.getAccountDetail);

router.get('/products', productController.getProductPageAPI);
router.get('/productDetail', productController.getProductDetail);



module.exports = router;

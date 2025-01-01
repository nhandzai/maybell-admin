var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');

router.get('/accounts', accountController.getAccountPage);
router.get('/products', productController.getProductPage);


module.exports = router;

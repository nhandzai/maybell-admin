var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');
const profileController = require('../components/profile/profile-controller');
const orderController = require('../components/order/order-controller');

router.get('/accounts', accountController.getAccountPageAPI);
router.post('/banAccount', accountController.banAccount);
router.get('/accountDetail', accountController.getAccountDetail);

router.get('/products', productController.getProductPageAPI);
router.get('/productDetail', productController.getProductDetail);
router.patch('/productUpdate', productController.updateProduct);
router.get('/brandCategory', productController.getListBrandCategory);
router.post('/brand', productController.addNewBrand);
router.post('/category', productController.addNewCategory);

router.post('/updateProfile',profileController.changeProfile);

router.get('/orders', orderController.getOrderPageAPI);
router.get('/orderDetail', orderController.getOrderDetail);
router.post('/changeOrderStatus', orderController.changeOrderStatus);
module.exports = router;

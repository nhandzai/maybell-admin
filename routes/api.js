const express = require('express');
const router = express.Router();
const multer = require('multer');

// Cấu hình multer cho từng trường hợp
const uploadAvatar = multer({ dest: 'uploads/' }).single('avatar'); 
const uploadImages = multer({ dest: 'uploads/' }).array('images', 10);
const uploadFile = multer({ dest: 'uploads/' }).array('updateImages', 10);

// Controllers
const accountController = require('../components/account/account-controller');
const productController = require('../components/product/product-controller');
const profileController = require('../components/profile/profile-controller');
const orderController = require('../components/order/order-controller');
const authController = require('../components/auth/auth-controller');
const reportController = require('../components/report/report-controller');

// Routes
router.get('/accounts', accountController.getAccountPageAPI);
router.post('/banAccount', accountController.banAccount);
router.get('/accountDetail', accountController.getAccountDetail);

router.get('/products', productController.getProductPageAPI);
router.get('/productDetail', productController.getProductDetail);
router.post('/productUpdate', uploadFile,productController.updateProduct);
router.get('/brandCategory', productController.getListBrandCategory);
router.post('/brand', productController.addNewBrand);
router.post('/category', productController.addNewCategory);
router.post('/product', uploadImages, productController.addNewProduct);

router.post('/updateProfile', uploadAvatar, profileController.changeProfile);

router.get('/orders', orderController.getOrderPageAPI);
router.get('/orderDetail', orderController.getOrderDetail);
router.post('/changeOrderStatus', orderController.changeOrderStatus);
router.post("/login", authController.authenticateUser);

router.get('/sales-report', reportController.getSalesReport);
router.get('/top-sales-report', reportController.getTopSalesReport);

module.exports = router;

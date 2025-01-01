var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');

router.get('/accounts', accountController.getAccountPageAPI);
router.post('/banAccount', accountController.banAccount);
router.get('/accountDetail', accountController.getAccountDetail);

module.exports = router;

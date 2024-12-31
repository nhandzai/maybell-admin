var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');

router.get('/accounts', accountController.getAccountPageAPI);

module.exports = router;

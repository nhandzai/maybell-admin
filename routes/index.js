var express = require('express');
var router = express.Router();

// Controllers
const accountController = require('../components/account/account-controller');

/* GET home page. */
router.get('/accounts', accountController.getAccountPage);

module.exports = router;

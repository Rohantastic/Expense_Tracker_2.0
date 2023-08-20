const express = require('express');
const route = express.Router();
const authentication = require('../AuthenticationMiddleWare/auth');
const purchaseController = require('../controllers/purchase');



route.get('/premiummembership',authentication.authenticate,purchaseController.purchasePremium);

route.post('/updatetransactionstatus',authentication.authenticate, purchaseController.updateTransactionStatus);
module.exports = route;
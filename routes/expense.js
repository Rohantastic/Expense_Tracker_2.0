const express = require('express');

const controller = require('../controllers/expense');
const route = express.Router();


route.get('/',controller.addCredentials);
route.post('/',controller.postCredentials);


module.exports = route;
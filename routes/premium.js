const express = require('express');
const route = express.Router();
const premiumController = require('../controllers/premium');

route.get('/leaderboard',premiumController.getLeaderBoard);
module.exports = route;
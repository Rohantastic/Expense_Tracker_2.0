const express = require('express');

const controller = require('../controllers/expense');
const route = express.Router();


//signup page
route.get('/signup',controller.signUpCredentials);

//signup posting into db
route.post('/login',controller.postCredentials);

//login
route.get('/login',controller.loginCredentials);

//user when logs in
route.post('/loggedin',controller.userLogIn)

module.exports = route;
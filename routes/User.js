const express = require('express');

const UserController = require('../controllers/User');
const route = express.Router();


//signup page
route.get('/signup',UserController.signUpCredentials);

//signup posting into db
route.post('/login',UserController.postCredentials);

//login
route.get('/login',UserController.loginCredentials);

//user log in
route.post('/loggedin',UserController.userLogIn)



module.exports = route;
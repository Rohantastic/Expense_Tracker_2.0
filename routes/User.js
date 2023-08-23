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




//get forgot password page
route.get('/password/forgotpassword',UserController.forgotPassword);

// verify the user to get password over email
route.post('/password/verification',UserController.forgotPasswordVerification);

route.post('/password/resetpassword',UserController.resettingPassword);


module.exports = route;
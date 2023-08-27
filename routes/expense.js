const express = require('express');
const route = express.Router();
const ExpenseController = require('../controllers/expense');
const authentication = require('../AuthenticationMiddleWare/auth');


//after user logs in
route.get('/addExpense',ExpenseController.addExpense);

//posting the expense after log in
route.post('/addExpense',authentication.authenticate,ExpenseController.postExpense);


//fetching the expenses from database
route.get('/getExpenses', authentication.authenticate ,ExpenseController.getExpenses);

//deleting the expense through id
route.delete('/deleteExpense/:id',authentication.authenticate, ExpenseController.deleteExpense);


//to show specific expense list
route.get('/monthlyExpense',authentication.authenticate, ExpenseController.getMonthlyExpense);

route.get('/dailyExpense',authentication.authenticate, ExpenseController.getDailyExpense);

route.get('/yearlyExpense',authentication.authenticate, ExpenseController.getYearlyExpense);


//downloading the expense file from amazon aws s3 storage
route.get('/download',authentication.authenticate, ExpenseController.downloadExpense);



module.exports = route;
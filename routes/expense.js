const express = require('express');
const route = express.Router();
const ExpenseController = require('../controllers/expense');



//after user logs in
route.get('/addExpense',ExpenseController.addExpense);

//posting the expense after log in
route.post('/addExpense',ExpenseController.postExpense);


route.get('/getExpenses', ExpenseController.getExpenses);

module.exports = route;
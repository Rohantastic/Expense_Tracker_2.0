const express = require('express');
const route = express.Router();
const ExpenseController = require('../controllers/expense');



//after user logs in
route.get('/addExpense',ExpenseController.addExpense);

//posting the expense after log in
route.post('/addExpense',ExpenseController.postExpense);


//fetching the expenses from database
route.get('/getExpenses', ExpenseController.getExpenses);

//deleting the expense through id
route.delete('/deleteExpense/:id',ExpenseController.deleteExpense);

module.exports = route;
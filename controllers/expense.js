const path = require('path');
const ExpenseModel = require('../models/expense');

exports.addExpense = (req,res,next) =>{
    const string = path.join(__dirname, '../', '/views/addExpense.html');
    console.log('get controller');
    res.sendFile(string);
    
}


exports.postExpense = async (req,res,next) =>{
    const expense = req.body.expense;
    const category = req.body.category;
    const description = req.body.description;
    try{
        const hasDataStored = await ExpenseModel.create({expense,category,description});
        if(hasDataStored){
            return res.status(201).json({success:"Expense Data has been created",expenseId: hasDataStored.id});
        }
    }catch(err){
        console.log(err);
    }
}
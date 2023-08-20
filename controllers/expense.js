const path = require('path');
const ExpenseModel = require('../models/expense');
const User = require('../models/User');

exports.addExpense = (req,res,next) =>{
    const string = path.join(__dirname, '../', '/views/addExpense.html');
    console.log('get controller');
    res.sendFile(string);
    
}

exports.postExpense = async (req,res,next) =>{
    const expense = req.body.expense;
    const category = req.body.category;
    const description = req.body.description;
    const id = req.user.userId;
    try{
        const hasDataStored = await ExpenseModel.create({expense,category,description, userId:id});
        if(hasDataStored){
            return res.status(201).json({success:"Expense Data has been created",expenseId: hasDataStored.id});
        }
    }catch(err){
        console.log(err);
    }
}

exports.getExpenses = async (req, res, next) => {
    try {
        const id = req.user.userId;
        const expenses = await ExpenseModel.findAll({where : {userId : id}});
        return res.status(200).json({ expenses });
    
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteExpense = async (req,res,next) =>{
    const id = req.params.id;
    try{
        const hasDeleted = await ExpenseModel.destroy({where:{id:id}});
        if(hasDeleted){
            return res.status(204).json({success:true});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Error in delete Expense"});
    }
}
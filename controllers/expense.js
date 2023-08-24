const path = require('path');
const AWS = require('aws-sdk');
const ExpenseModel = require('../models/expense');
const User = require('../models/User');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

exports.addExpense = (req, res, next) => {
    const string = path.join(__dirname, '../', '/views/addExpense.html');
    res.sendFile(string);
};

exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction(); //transaction
    const expense = req.body.expense;
    const category = req.body.category;
    const description = req.body.description;
    const id = req.user.userId;
    try {
        const hasDataStored = await ExpenseModel.create({ expense, category, description, userId: id }, { transaction: t });
        if (hasDataStored) {
            await t.commit();
            return res.status(201).json({ success: "Expense Data has been created", expenseId: hasDataStored.id });
        }
    } catch (err) {
        await t.rollback();
        console.log(err);
    }
};

const ITEMS_PER_PAGE = 10; 

//getExpense to Display expenses on screen using pagination
exports.getExpenses = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    try {
        const id = req.user.userId;
        const totalItems = await ExpenseModel.count({ where: { userId: id } });
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const expenses = await ExpenseModel.findAll({
            where: { userId: id },
            offset: offset,
            limit: ITEMS_PER_PAGE
        });
        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred" });
    }
};



//function to delete the expense from table
exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    const id = req.params.id;
    const tokenId = req.user.userId;
    try {
        const hasDeleted = await ExpenseModel.destroy({ where: { id: id, userId: tokenId } }, { transaction: t });
        if (hasDeleted) {
            await t.commit();
            return res.status(204).json({ success: true });
        } else {
            return res.status(401).json({ error: "User is not authorized to delete the expense" });
        }
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: "Error in delete Expense" });
    }
};

//amazon S3 function to files to S3 Storage
async function uploadToS3(data, filename) { //data has all the expenses
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read' //so that it should be accessible to all
    };

    try {
        const s3response = await s3bucket.upload(params).promise(); //it returns promise, first we uploading and then returning promise
        console.log('success', s3response); //printing if we get successful response
        return s3response.Location; //getting the link returning it
    } catch (err) {
        console.log(err); //else get the error
    }

}
exports.downloadExpense = async (req, res, next) => {
    const id = req.user.userId; //fetching id from auth middleware
    try {
        const expenses = await ExpenseModel.findAll({ where: { userId: id } }); //finding all the expenses related to foreignkey userId
        if (expenses) {
            const stringifiedExpenses = JSON.stringify(expenses); //converting to string 
            const filename = `Expense${id}/${new Date()}.txt`; //to make every file distinct of each other

            const object = []; //created array to show on screen, new button to view download history
            object.push(filename); // pushing all the filenames, into array.
            const fileURL = await uploadToS3(stringifiedExpenses, filename);
            return res.status(200).json({ fileURL, success: true, fileHistory: object }); //sending fileURL and object array to frontEnd via json
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "error in downloading" });
    }
};
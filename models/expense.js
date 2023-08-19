const Sequelize = require('sequelize');
const database = require('../config/database');
//const User = require('./User');

const Expense = database.define('expense',{
    id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    expense: {
        type: Sequelize.DataTypes.INTEGER
    },
    category:{
        type: Sequelize.DataTypes.STRING
    },
    description:{
        type: Sequelize.DataTypes.STRING
    }
},{
    timestamps:false
});


module.exports = Expense;
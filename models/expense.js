const {Sequelize,DataTypes} = require('sequelize');
const database = require('../config/database');

const Expense = database.define('expense2',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique:true
    }
    ,
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },

    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    }
    ,
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps:false
});


Expense.sync({alter:true});


module.exports = Expense;
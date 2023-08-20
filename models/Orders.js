//table for premium purchase from razorpay
const Sequelize = require('sequelize');
const sequelizeDatabase = require('../config/database');

const Order = sequelizeDatabase.define('order',{
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique:true
    },
    paymentid: Sequelize.DataTypes.STRING,
    orderid: Sequelize.DataTypes.STRING,
    status: Sequelize.DataTypes.STRING
},{
    timestamps:false
});


module.exports = Order;
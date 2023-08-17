const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenseTracker','root','root',{
    host:'localhost',
    dialect:'mysql'
})

module.exports = sequelize;
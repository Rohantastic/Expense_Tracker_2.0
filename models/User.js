const {Sequelize,DataTypes} = require('sequelize');
const database = require('../config/database');

const User = database.define('user',{
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


User.sync({alter:true});


module.exports = User;
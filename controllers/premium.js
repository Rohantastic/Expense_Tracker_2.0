const User = require('../models/User');
const Expense = require('../models/expense');
const Sequelize = require('sequelize');

exports.getLeaderBoard = async (req,res,next)=>{

    try {
        const premiumUsersExpenses = await User.findAll({
            attributes: [
              'name',
              'id',
              [Sequelize.fn('SUM', Sequelize.col('expenses.expense')), 'ExpenseAmount'],
            ],
            include: [
              {
                model: Expense,
                attributes: [],
              },
            ],
            group: ['User.id', 'User.name'], 
            having: Sequelize.literal('ExpenseAmount > 0'),
            order: [[Sequelize.fn('SUM', Sequelize.col('expenses.expense')), 'DESC']],
          });
          
          return res.status(200).json(premiumUsersExpenses);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching premium user expenses.' });
      }
}
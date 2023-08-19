const express = require('express');
const app = express();
const UserRoute = require('./routes/User');
const ExpenseRoute = require('./routes/expense');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const User = require('./models/User');
const Expense = require('./models/expense');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Synchronize the tables with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

app.use('/user', UserRoute);
app.use('/expense', ExpenseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

app.listen(3000, (err) => {
    console.log('Server Initialised...');
    console.error(err);
});

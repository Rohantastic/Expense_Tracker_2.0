const express = require('express');
const app = express();
const UserRoute = require('./routes/User');
const ExpenseRoute = require('./routes/expense');
const PurchaseRoute = require('./routes/purchase');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const User = require('./models/User');
const Expense = require('./models/expense');
const Order = require('./models/Orders');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//routes
app.use('/user', UserRoute);
app.use('/expense', ExpenseRoute);
app.use('/purchase',PurchaseRoute);


//database relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


// Synchronizing the tables with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });


app.listen(3000, (err) => {
    console.log('Server Initialised...');
    console.error(err);
});

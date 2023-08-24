const express = require('express');
const fs = require('fs');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const UserRoute = require('./routes/User');
const ExpenseRoute = require('./routes/expense');
const PurchaseRoute = require('./routes/purchase');
const PremiumRoute = require('./routes/premium');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const User = require('./models/User');
const Expense = require('./models/expense');
const Order = require('./models/Orders');
const PasswordRequest = require('./models/ForgotPasswordRequests');
const path = require('path');

app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});//creating a log files to view all console logs on a log file

//routes
app.use('/user', UserRoute);
app.use('/expense', ExpenseRoute);
app.use('/purchase',PurchaseRoute);
app.use('/premium',PremiumRoute);
app.use(helmet()); //gives security to headers
app.use(compression()); //compresses the files over network
app.use(morgan('combined',{ stream: accessLogStream})); //morgan helps log on terminal or file, than that of console(which makes systen laggy)


//database relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(PasswordRequest);
PasswordRequest.belongsTo(User);


// Synchronizing the tables with the database
sequelize.sync()
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    console.log('Server Initialised...');
    console.error(err);
});

const express = require('express');
const app = express();
const UserRoute = require('./routes/User');
const ExpenseRoute = require('./routes/expense');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use('/user',UserRoute);
app.use('/expense',ExpenseRoute);

app.listen(3000,(err)=>{
    console.log('working');
    console.log(err);
});
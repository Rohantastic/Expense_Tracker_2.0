const express = require('express');
const app = express();
const route = require('./routes/expense');


app.use(express.urlencoded({extended:true}));

app.use(express.json());


app.use('/',route);

app.listen(3000,(err)=>{
    console.log('working');
    console.log(err);
});
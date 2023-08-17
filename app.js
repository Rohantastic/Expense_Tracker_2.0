const express = require('express');
const app = express();
const route = require('./routes/expense');
app.set(express.urlencoded);

app.use(express.json());


app.use('/',route);

app.listen(1234,()=>{
    console.log('working');
});
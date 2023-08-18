const path = require('path');
const ExpenseModel = require('../models/expense');

exports.signUpCredentials = (req, res) => {
    const string = path.join(__dirname, '../', '/views/signup.html');
    console.log('get controller');
    res.sendFile(string);
}

exports.postCredentials = async (req, res) => {
    const { name, email, password } = req.body;

    if (name.length <= 0 || email === undefined || password === undefined){

        const errorMessage = "Please fill out all fields.";
        return res.send(`
        <p style="color: red;">${errorMessage}</p>
        <form action="/login" method="get">
            <button>Back</button>
        </form>
    `);
    }
    else {
        try {
            const existingUser = await ExpenseModel.findOne({ where: { email: email } });

            if (existingUser) {

                setTimeout(() => {
                    return res.send(`
                        USER ALREADY EXISTS!! PRESS BACK TO REGISTER NEW USER
    
                        <form action="/login" method='get'>
                        <input type="hidden">
                        <button>Back</button>
                        </form>
                    `)
                }, 100
                );

            } else {
                await ExpenseModel.create({ name, email, password }).then(() => {
                    res.status(201);
                    return res.redirect('/');
                })
                    .catch(error => {
                        console.error('Error creating user:', error);
                        return res.status(500).send('Internal server error');
                    });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).send('Internal server error');
        }
    }
};


//login the credentials

exports.loginCredentials = (req, res, next) => {
    const string = path.join(__dirname, '../', '/views/login.html');
    res.sendFile(string);
}

exports.userLogIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    //const existingUser = await ExpenseModel.findOne({ where: { email: email } });
    try {
        const userFromDatabase = await ExpenseModel.findOne({ where: { email: email } });
        if (userFromDatabase) {
            if (userFromDatabase.password === password) {
                res.status(200).send(`<h1> Login Successful </h1>`);
            } else {
                res.status(401).send(`<h1> User Not Authorized, Password Not Matched !! </h1>`);
            }
        }
    } catch (err) {
        res.status(404).send(`<h1> User Not Found !! </h1>`);
    }

}
const path = require('path');
const ExpenseModel = require('../models/expense');

exports.addCredentials = (req, res) => {
    const string = path.join(__dirname, '../', '/views/index.html');
    console.log('get controller');
    res.sendFile(string);
}

exports.postCredentials = async (req, res) => {
    const { name, email, password } = req.body;

    if (name.length <= 0 || email === undefined || password === undefined) {
        
        const errorMessage = "Please fill out all fields.";
        return res.send(`
        <p style="color: red;">${errorMessage}</p>
        <form action="/" method="get">
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
    
                        <form action="/" method='get'>
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

const path = require('path');
const ExpenseModel = require('../models/expense');

exports.addCredentials = (req,res) =>{
    const string = path.join(__dirname,'../','/views/index.html');
    console.log('get controller');
    res.sendFile(string);   
}

exports.postCredentials = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await ExpenseModel.findOne({ where: { email: email } });

        if (existingUser) {

            setTimeout(()=>{
                return res.send(`
                    USER ALREADY EXISTS!! PRESS BACK TO REGISTER NEW USER

                    <form action="/" method='get'>
                    <input type="hidden">
                    <button>Back</button>
                    </form>
                `)
            }, 5000
            );
             
        } else {
            await ExpenseModel.create({ name, email, password }); // Create new user
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send('Internal server error');
    }
};

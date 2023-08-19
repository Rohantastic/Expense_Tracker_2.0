const path = require('path');
const bcrypt = require('bcrypt');
const UserModel =  require('../models/User');

exports.signUpCredentials = (req, res) => {
    const string = path.join(__dirname, '../', '/views/signup.html');
    console.log('get controller');
    res.sendFile(string);
}

exports.postCredentials = async (req, res) => {
    const { name, email, password } = req.body;

    if (name.length <= 0 || email === undefined || password === undefined) {
        throw new Error("Error in length");
    } else {
        try {
            const existingUser = await UserModel.findOne({ where: { email: email } });

            if (existingUser) {
                return res.status(401).json({ error: 'User already exists' });
            }
            else {

                try {
                    bcrypt.hash(password, 10, async (err, hash) => {
                        const isDataCreated = await UserModel.create({ name, email, password: hash })
                        if (isDataCreated) {
                            return res.status(201).json({success:true});
                        } else {
                            throw new Error("User cannot be created");
                        }
                    });

                } catch (err) {
                    return res.status(500).json({error:"error in signing up"});
                }

            }
        } catch (error) {
            return res.status(500).json({error:"error in catch of signing up"});
        }
    }
};




//login the credentials

exports.loginCredentials = (req, res, next) => {
    const string = path.join(__dirname, '../', '/views/login.html');
    res.sendFile(string);
}


//when user logs in
exports.userLogIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UserModel.findOne({ where: { email: email } });
        
        const userEmail = user.email; 
        if (userEmail!==email) {
            return res.status(401).json({ error: "user not found in bcrypt" });
        }
        else {

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).json({ message: "successfully found the password in bcrypt", id: user.id});
                } 
                else {
                    res.status(401).json({ error: "password doesnt match" });
                }
            });
        }
    } catch (error) {

        console.log('................................................................');
        console.log(error);
        return res.status(500).json({error:"User Not Found"});
    }
};


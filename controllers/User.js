const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



function generateAccessToken(id, ispremiumuser, name) {
    return jwt.sign({ userId: id, ispremiumuser: ispremiumuser, name: name }, "b6b5742d7d780baf8e42d5c3e41e6e3a25dcf8df05b26c3d6e21c03f531e4928");//secret key
}

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
                            return res.status(201).json({ success: true });
                        } else {
                            throw new Error("User cannot be created");
                        }
                    });

                } catch (err) {
                    return res.status(500).json({ error: "error in signing up" });
                }

            }
        } catch (error) {
            return res.status(500).json({ error: "error in catch of signing up" });
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
        if (userEmail !== email) {
            return res.status(401).json({ error: "user not found in bcrypt" });
        }
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).json({ message: "successfully found the password in bcrypt", token: generateAccessToken(user.id, user.ispremiumuser, user.name) });
                }
                else {
                    res.status(401).json({ error: "password doesnt match" });
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "User Not Found" });
    }
};


//forgot password page for user
exports.forgotPassword = (req, res, next) => {
    const string = path.join(__dirname, '../', '/views/forgotPassword.html');
    res.sendFile(string);
}

//forgot password functionality
exports.forgotPasswordVerification = async (req, res, next) => {
    const email = req.body.email;
    try {


        const user = await UserModel.findOne({ where: { email: email } });


        if (user) {
            console.log('>>seeing if i am able to send the response');
            return res.status(200).json({ success: true });
        } else {
            res.status(401).json({ error: "User is unauthorized" });
        }


    } catch (err) {
        console.log(err);
        res.status(500);
    }

};

exports.resettingPassword = async (req, res, next) => {

    const emailOfUser = req.body.email;
    try {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'rohan.expensetracker@gmail.com',
                pass: 'sevclawiruwcteai'
            }
        });
        var mailOptions = {
            from: 'rohan.expensetracker@gmail.com',
            to: emailOfUser,
            subject: "OTP For Login",
            text: `Your OTP is ${emailOfUser} to login`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Mail Sent Successfully.");
                return res.status(200).json({success:true});
            }
        });
    }catch(err){
        console.log(err);
    }
};



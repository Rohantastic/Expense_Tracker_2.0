const jwt = require('jsonwebtoken');
const User = require('../models/User');


//to decrypt the token
exports.authenticate = async (req,res,next)=>{
    try{
        const token = req.header('authorization');
        const userObject = jwt.verify(token,"b6b5742d7d780baf8e42d5c3e41e6e3a25dcf8df05b26c3d6e21c03f531e4928");
        const user = await User.findByPk(userObject.userId);
        if(user){
            req.user = userObject;
            next();
        }
    }catch(err){
        console.log('>>>>>>>>>>>>in catch block of auth.js because we didnt get the user from userObject.userId');
        return res.status(500).json({error:"something wrong in authenticating"});
    }
};
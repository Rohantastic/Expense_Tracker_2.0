const path = require('path');


exports.addCredentials = (req,res) =>{
    const string = path.join(__dirname,'../','/views/index.html');
    
    res.sendFile(string);
}

exports.postCredentials =  (req,res) =>{
    console.log('post controller');
    const { name, email, password } = req.body;
    res.send(`
    
    ${name} , ${email} , ${password}
    
    `)
    res.json({
        name,
        email,
        password
    });
}
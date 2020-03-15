const path = require('path');

module.exports = {
    getHomePage: (req, res) => {
        console.log("Dentro da função callback da homepage.");
        console.log(req.sessionID);
        //res.send(`Você chegou na nossa home!\n`);
        res.render('index.html'); 
        //res.sendFile('index.html')
    }
};
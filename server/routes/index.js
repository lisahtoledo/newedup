module.exports = {
    getHomePage: (req, res) => {
        console.log("Dentro da função callback da homepage.");
        console.log(req.sessionID);
        res.send(`Você chegou na nossa home!\n`); 
    }
};
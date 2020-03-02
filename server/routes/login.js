module.exports = {
    getLoginPage: (req, res) => {
        console.log("Dentro da rota GET de login.");
        console.log(req.sessionID);
        res.send("Você chegou na página de login!\n");
    },

    postLoginUser: (req, res, next) => {
        console.log("Dentro da rota POST de login.");
        passport.authenticate("local", (err, user, info) => {
            console.log("Dentro do callback de passport.authenticate");
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            req.login(user, (err)=>{
                console.log('Dentro da callback de req.login()');
                console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
                console.log(`req.user: ${JSON.stringify(req.user)}`);
                return res.send("Você foi autenticadx e logadx!\n");
            });
        }) (req, res, next);    
    }
}
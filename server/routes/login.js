module.exports = {
    getLoginPage: (req, res) => {
        console.log("Dentro da rota GET de login.");
        console.log(req.sessionID);
        res.send("Você chegou na página de login!\n");
    },

    postLoginUser: (req, res, next, passport) => {
        console.log("Dentro da rota POST de login.");
        passport.authenticate("local", (err, user, info) => {
            console.log("Dentro do callback de passport.authenticate");
            if(info) return res.send(info.message);
            if(err) return next(err);
            if(!user) return res.redirect('/login');
            req.login(user, (err)=>{
                console.log('Dentro da callback de req.login()');
                console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
                console.log(`req.user: ${JSON.stringify(req.user)}`);
                if(err) return next(err);
                return res.redirect('/authRequired');
            });
        }) (req, res, next);    
    }
}
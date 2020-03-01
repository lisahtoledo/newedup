//módulos npm
const express = require("express"); 
const { v4: uuidv4 } = require('uuid');
const session = require("express-session");
const FileStore = require("session-file-store")(session); //TO DO: Substituir por um módulo que salva no BD.
const bodyParser = require("body-parser"); 
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const users = [
    {id: '2f24vvg', email: 'test@test.com', password: 'password'}
  ]

// configura passport.js para usar a estratégia local
passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) => {
        console.log("Dentro do callback da estratégia local.");
        
        // aqui é onde aconteceria a chamada para o BD para
        // encontrar o usuário baseado no username ou endereço de email
        // por hora, vamos fingir que encontramos e é igual a users[0].
       
        const user = users[0];
        if(email === user.email && password === user.password){
            console.log('Estratégia local retornou true');
            return done(null, user);
        }
    }
));

// diz para o passport serializar o usuário
passport.serializeUser((user, done) =>{
    console.log("Dentro do callback de serializeUser. A id do usuário é salva no arquivo de armazenamento da sessão aqui.");
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("Dentro da Callback de deserializeUser.");
    console.log(`A id de usuário que o passport salvou no arquivo de armazenamento de sessão é: ${id}`);
    const user = users[0].id === id ? users[0] : false;
    done(null, user);
});
// cria o servidor 
const app = express();  

// adiciona e configura middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    genid: (req) => {
        console.log("Dentro da função genid do   middleware de Sessão.")
        console.log(`sessionID do objeto request do cliente : ${req.sessionID}`);
        return uuidv4(); // usa UUID's para ID da sessão
    },
    store: new FileStore(),
    secret: 'gato teclado', // na fase de produção isso deve ser alterado por uma string gerada aleatoriamente com base em uma environment variable.
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// cria a rota para a homepage em '/'
app.get('/', (req, res) => {
    console.log("Dentro da função callback da homepage.");
    console.log(req.sessionID);
    res.send(`Você chegou na nossa home!\n`); 
}); 

// cria as rotas de GET  e POST de login
app.get('/login', (req, res) => {
    console.log("Dentro da rota GET de login.");
    console.log(req.sessionID);
    res.send("Você chegou na página de login!\n");
});

app.post('/login', (req, res, next) => {
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
});

app.get('/authRequired', (req, res) => {
    console.log("Dentro da rota GET de /authRequired");
    console.log(`Usuário autenticado? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        res.send("Você chegou no endpoint de autenticação!\n");
    } else {
        res.redirect('/');
    }
})
// diz para o servidor em que porta ouvir
app.listen(3000, ()=>{
    console.log("Ouvindo na porta 3000");
}); 

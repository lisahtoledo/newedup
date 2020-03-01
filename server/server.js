//módulos npm
const express = require("express"); 
const uuid = require("uuid/v4");
const session = require("express-session");
const FileStore = require("session-file-store")(session); //TO DO: Substituir por um módulo que salva no BD.
// cria o servidor 
const app = express();  

// adiciona e configura middleware
app.use(session({
    genid: (req) => {
        console.log("Dentro do middleware de Sessão.")
        console.log(req.sessionID);
        return uuid(); // usa UUID's para ID da sessão
    },
    store: new FileStore(),
    secret: 'gato teclado', // na fase de produção isso deve ser alterado por uma string gerada aleatoriamente com base em uma environment variable.
    resave: false,
    saveUninitialized: true
}));

// cria a rota para a homepage em '/'
    app.get('/', (req, res) => {
        console.log("Dentro da função callback da homepage.")
        console.log(req.sessionID);
        res.send(`Você chegou na nossa home!\n`); 
}); 

// diz para o servidor em que porta ouvir
app.listen(3000, ()=>{
    console.log("Ouvindo na porta 3000");
}); 
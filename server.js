//módulos npm
const express = require("express"); 
const { v4: uuidv4 } = require('uuid');
const session = require("express-session");
const FileStore = require("session-file-store")(session); //TO DO: Substituir por um módulo que salva no BD.
const bodyParser = require("body-parser"); 
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const path = require('path');
const nunjucks = require('nunjucks');
  
// configuração da conexão com o banco de dados
const dbconfig = require("./config/database");

// cria conexão com o banco de dados
var conn = mysql.createPool({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});

conn.connect((err) => {
    if(err) throw err;
    console.log("Conectando ao MySql..."); 
});

// escopo global
global.db = conn;
global.passport = passport;

// configura passport.js para usar a estratégia local
passport.use(new LocalStrategy(
    {usernameField: 'email',
     passwordField: 'password'},
     
    (email, password, done) => {
        console.log("Dentro do callback da estratégia local.");
        
        // Query SQL para encontrar um usuário com o mesmo email providenciado.
        db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) =>{
            if(err) return done(err, false); 

            // testa se o usuário existe no BD
            if(!results.length) {
                return done(null, false, {message: 'Usuário não encontrado.\n'});
            }

            // caso o usuário exista, mas a senha não corresponda
            if(!(results[0].password === password)){
                return done(null, false, {message: 'Senha incorreta!\n'});
            }
            
            return done(null, results[0]);

        });
    })
);

// diz para o passport serializar o usuário
passport.serializeUser((user, done) =>{
    console.log("Dentro do callback de serializeUser. A id do usuário é salva no arquivo de armazenamento da sessão aqui.");
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("Dentro da Callback de deserializeUser.");
    console.log(`A id de usuário que o passport salvou no arquivo de armazenamento de sessão é: ${id}`);
    const user = db.query("SELECT * FROM Users WHERE id = ?", [id], (err, results) => {
        if(err) return done(err, false);
        return done(null, results[0]);
    })
});

// cria o servidor 
const app = express();  

// funções callback das rotas
const {getHomePage} = require("./routes/index");
const {getLoginPage, postLoginUser} = require("./routes/login");
const {getAboutPage} = require("./routes/sobrenos");
const {getCompanyProfile, getCompanyPannel,  
        getNewCompanyForm, postNewCompany} = require("./routes/company");
const {getNewStudentForm, postNewStudent} = require("./routes/student");
const {getNewCourseForm, postNewCourse} = require("./routes/course");

// adiciona e configura middleware
app.use(bodyParser.urlencoded({extended: true}));
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
app.use(express.static(path.join(__dirname, '/public')));

// configuração do nunjucks
nunjucks.configure(__dirname + '/views', {
    autoescape: true,
    express: app
});

// cria a rota para a homepage em '/'
app.get('/', getHomePage); 

// cria as rotas de GET  e POST de login
app.get('/login', getLoginPage);
app.post('/login', postLoginUser);

// cria a rota da página 'Sobre Nós'

app.get('/sobrenos', getAboutPage);

// cria a rota para cadastro de novos alunos
app.get('/cadastroAluno', getNewStudentForm);
app.post('/cadastroAluno', postNewStudent);

// cria a rota da página 'Perfil Empresa'
app.get('/perfilEmpresa', getCompanyProfile);
app.get('/painelEmpresa:id', getCompanyPannel);

// cria a rota para cadastro de empresas
app.get('/cadastroEmpresa', getNewCompanyForm);
app.post('/cadastroEmpresa', postNewCompany); 

// cria a rota para cadastro de cursos
app.get('/cadastroCurso', getNewCourseForm);
app.post('/cadastroCurso', postNewCourse); 


app.get('/authRequired', (req, res) => {
    console.log("Dentro da rota GET de /authRequired");
    console.log(`Usuário autenticado? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        res.redirect('/painelEmpresa:' + req.user.id);
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

// diz para o servidor em que porta ouvir
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Ouvindo na porta 3000");
}); 

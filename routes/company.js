module.exports = {
    getCompanyProfile: (req, res) => {
        res.render("perfilEmpresa.html");
    },

    getCompanyPannel: (req, res) => {
        console.log(req.user.id);
        

        db.query('SELECT nome FROM Empresas where usr_id=?', [req.user.id], (err, results) => {
            if(err) res.status(500).send(err);
            
            req.user.company = results[0]; 
            console.log (results);  
            res.render("crudEmpresa.njk", {user: req.user});
        })
        
        console.log(req); 
        
    },

    getNewCompanyForm: (req, res) => {
        res.render('formEmpresa.html');
    }, 

    postNewCompany: (req,res) => {
        console.log("Tentando cadastrar nova empresa.\n");
        adress = req.body.cep + " " + req.body.numero + ", " + req.body.complemento;  
        console.log("Endereço: ", adress); 
        
        let userQuery = "SELECT * FROM Users WHERE email=?;";
        let insertUserQuery = "INSERT INTO Users(email, password, type) VALUES (?,?,'company');";
        let cnpjQuery = "SELECT * FROM Empresas WHERE cnpj=?";
        let insertCompanyQuery = "INSERT INTO Empresas(cnpj, nome, endereco, usr_id) VALUES (?,?,?,?);";
        
        // query para testar se já existe um usuaŕio com o mesmo e-mail.
        db.query(userQuery, [req.body.emailEmp], (err, results) => {
            if(err) return res.status(500).send(err);

            if(results.length) return res.send("E-mail já cadastrado!"); 
            
            // se não existe usuário cadastrado com o mesmo e-maill, cadastra um novo usuário no banco.
            db.query(insertUserQuery, [req.body.emailEmp, req.body.csenha], (err, results) => {
                if(err) return res.status(500).send(err);
                console.log("Cadastrado novo usuário no email: ", req.body.emailEmp);
                
                // variável que armazena o Id de usuário gerado pelo auto increment do banco.
                var newId = results.insertId;
                console.log("ID do novo usuário: ", newId);
                
                // query para testar se uma empresa com o mesmo cnpj já existe no banco
                db.query(cnpjQuery, [req.body.cnpj], (err, results) => {
                    if(err) return res.status(500).send(err);
                    
                    if(results.length) return res.send("Empresa já cadastrada!"); 
                
                    // se não existe nenhuma empresa com esse cnpj, cadastra uma nova empresa no banco.
                    db.query(insertCompanyQuery, [req.body.cnpj, req.body.nomeEmpresa, adress, newId], (err, results) => {
                        if(err) return res.status(500).send(err);
                        console.log("Empresa cadastrada: ", req.body.nomeEmpresa);
                        res.redirect('/login');
                    });
                });
            });
        });
    }

    
}
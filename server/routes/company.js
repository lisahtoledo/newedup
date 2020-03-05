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

    getNewCourseForm: (req, res) => {
        res.render('novoCurso.html');
    },

    getNewCompanyForm: (req, res) => {
        res.render('formEmpresa.html');
    }, 

    postNewCompany: (req,res) => {
        console.log("Tentando cadastrar nova empresa.\n");

    }

    
}
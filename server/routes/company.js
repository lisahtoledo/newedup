module.exports = {
    getCompanyProfile: (req, res) => {
        res.render("perfilEmpresa.html");
    },

    getCompanyPannel: (req, res) => {
        console.log(req.user.id);
        

        db.query('SELECT nome FROM Empresas where usr_id=?', [req.user.id], (err, results) => {
            if(err) res.status(500).send(err);
            
            req.user.name = results[0].nome; 
            res.render("crudEmpresa.njk", {user: req.user});
        })
        
        console.log(req); 
        
    },

    getNewCourseForm: (req, res) => {
        res.render('novoCurso.html');
    }
}
module.exports = {
    getNewCourseForm: (req, res) => {
        console.log(req.body.user);
        if(req.isAuthenticated() && req.user.type == 'company')
            res.render('novoCurso.html');
        else
            res.status(403).send("Você não tem permissão para acessar essa página!\n");
        return;
    },

    postNewCourse: (req, res) => {
        console.log("Tentando postar novo curso");
        if(req.isAuthenticated())
            console.log(req.body.user);
        else
            res.status(403).send("Você não tem permissão para realizar essa ação!");
        return;
    }
}

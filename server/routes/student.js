module.exports = {
    getNewStudentForm: (req, res) => {
        res.render('formAluno.html');
    },

    postNewStudent: (req, res) => {
        console.log("Tentando cadastrar novo aluno");
    }
}
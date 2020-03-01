const url='http://127.0.0.1:3333/login'
const form = new FormData(document.getElementById('login-form'));

fetch(url, {
    method:'POST',
    body: form
})
.then((response) => {
    response.json();
})
.then((data) => {
    console.log('Sucesso: ', data);
})
.catch((error) => {
    console.error('Erro: ', error);
});

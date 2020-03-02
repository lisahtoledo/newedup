<h1>newEdUp</h1>

### Para criar o Banco de Dados localmente:
1. Tenha certeza de ter o MySql e o node.js instalados localmente
2. Em um terminal rode:
        `$ cd server/scripts/`
        `$ node createdatabase.js`
3. Entre com seu usuário e senha do MySql
4. O script criará o banco *edup* contendo a tabela *Users* e o usuário de testes *test@test.com* com a senha *password*    

### Para rodar o projeto localmente: 
1. Adicione suas credenciais do MySql nos campos *user* e *password* do arquivo _config/database.js_
2. Na pasta _server/_ rode o comando:
        `$ node dev:server`
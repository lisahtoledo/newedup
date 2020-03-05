<h1>newEdUp</h1>

### Para criar o Banco de Dados localmente:
1. Tenha certeza de ter o MySql e o node.js instalados localmente
2. Em um terminal rode, substituindo suas credenciais do MySQL com permissão de criar BD's:
        
    `[usr@newedup] $ mysql -u <seu usuário> -P<sua senha>  <  edup_db_backup.sql`

### Para rodar o projeto localmente: 
1. Adicione suas credenciais do MySql nos campos **user** e **password** do arquivo _config/database.js_
2. Na pasta _server/_ rode o comando:
        
    `$ node dev:server`

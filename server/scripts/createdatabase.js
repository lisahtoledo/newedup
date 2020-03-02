const readline = require('readline');
const mysql=require('mysql');
const dbconfig=require('../config/database');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Digite seu usuário do MySql: ", (user) => {
    rl.question("Digite sua senha do MySql:", (password) => {
        dbconfig.connection.user = user;
        dbconfig.connection.password = password;
        console.log(dbconfig.connection.user, dbconfig.connection.password);
        
        const connection = mysql.createConnection(dbconfig.connection);

        connection.query('CREATE DATABASE ' + dbconfig.database, (err) => {
            if(err){ 
                console.log(err);
                return err;
            } else {
                console.log("Banco de Dados " + dbconfig.database + " criado com sucesso!\n");
                connection.query('\
                    CREATE TABLE ' + dbconfig.database + '.' + dbconfig.users_table + '( \
                        id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
                        email VARCHAR(100) NOT NULL, \
                        password CHAR(100) NOT NULL, \
                        PRIMARY KEY (`id`) \
                        )ENGINE=InnoDB DEFAULT CHARSET=utf8;', (err) => {
                            if(err){ 
                                console.log(err);
                                return err;
                            } else {
                                console.log("Tabela Users criada com sucesso!\n")
                                connection.query('INSERT INTO ' + dbconfig.database + '.' + dbconfig.users_table + ' (email, password) VALUES ("test@test.com", "password");', (err) => {
                                    if(err){ 
                                        console.log(err);
                                    } else { 
                                        console.log("Usuário de testes criado com sucesso!\n");
                                    }
                                    connection.end();
                                })
                            }
                });
            }        
        });
        rl.close();
    });
});


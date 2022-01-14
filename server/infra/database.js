const pgp = require('pg-promise')();    //Biblioteca para interagir com o banco de dados.
const db = pgp({
    user: 'postgres',
    password: 'odiseia',                //nunca deixar a senha assim em producao
    host: 'localhost',
    port: 5432,
    database: 'postgres'
})

module.exports = db;
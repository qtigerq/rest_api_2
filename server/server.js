const express = require('express');
const app = express();

//middlewares
app.use(express.json())
app.use('/', require('./route/postsRoute'));                //Delega para postRoute o tratamento das requisições que chegarem em '/'

app.use(function(error, req, res, next) {                   //Tratamento de erros (ERROR HANDLER)

    if (error.message === 'Post already exists') {
        res.status(409).send(error.message);                    //devolve o status finaliza devolveldo a mensagem de erro para o cliente
    }
    if (error.message === 'Post not found') {
        res.status(404).send(error.message);                    //''
    }

    res.status(500).send(error.message);                   //Caso não saiba o erro, retorna 500 (INTERNAL SERVER ERROR)
    

});

app.listen(3000);   
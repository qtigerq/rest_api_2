const express = require('express');
const router = express.Router();
const postsService = require('../service/postsService');

//CRUD BASICO - com quem deve interagir, que dados deve extrair e quais devem ser devolvidos
router.get('/posts', async function(req, res, next){
    try {
        const posts = await postsService.getPosts();
        res.json(posts);
    } catch (e) {
        next(e);                                                //chama o próximo middleware que é o tratamento de erro
    }
});

router.post('/posts', async function(req, res, next){           //criação deste recurso
    const post = req.body;                                      //pega o post que chega
    try {
        const newPost = await postsService.savePost(post);      //post que esta sendo criado
        res.status(201).json(newPost);                          //devolve o newPost e o status 201 (CREATED)
    } catch (e) {
        next(e);
   }
});

router.put('/posts/:id', async function(req, res, next){        //criação deste recurso
    const post = req.body;                                      //pega o post que chega
    try {
        await postsService.updatePost(req.params.id, post);     //post que esta sendo criado
        res.status(204).end();                                  //devolve o status 204 (NO CONTENT)
    } catch (e) {
        next(e);
    }
});

router.delete('/posts/:id', async function(req, res, next){     //criação deste recurso
    try {
        await postsService.deletePost(req.params.id);           //post que esta sendo deletado
        res.status(204).end();                                  //devolve o status 204 (NO CONTENT)
    } catch (e) {
        next (e);
    }
});

module.exports = router;
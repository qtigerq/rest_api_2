const crypto = require('crypto');                                                               //para gerar strigs randomicas de forma a gerar cenários iniciais e deixar os testes menos viciados
const axios = require('axios');                                                                 //biblioteca HTTP para fazer requisições - https://axios-http.com/docs/intro
const postsService = require('../service/postsService');                                        //Obtem a camada de serviços

const generate = (chars) => {                                                                   //função para gerar strings randomicas de 20 caracteres
    return crypto.randomBytes(chars).toString('hex');
};

const request = (url, method, data) => {                                                        //funcao para enviar a requisicao usando o Axios
    return axios({url, method, data, validateStatus: false});                                   //ValidadeStatus: falso faz com que o Axios não valide o status automaticamente e deixe o controle na mão do programador.
}                                                                                                   //visto que ele aborta o fluxo de execução caso o status seja diferente de 200.

const createRandomPost = async () => {
    return await postsService.savePost({ title: generate(6), content: generate(10)});
}

//TESTE QUE SERVIRÁ DE MODELO PARA OS DEMAIS
test('Should get posts', async function(){
    
    //given - "dado que" (INSERE DADOS NA BASE PARA FAZER O TESTE)
    //const post1 = await postsService.savePost({ title: generate(6), content: generate(10)});    //await para esperar inserir antes de continuar o teste, senao pode dar resultado errado
    const post1 = createRandomPost();
    const post2 = await postsService.savePost({ title: generate(6), content: generate(10)});
    const post3 = await postsService.savePost({ title: generate(6), content: generate(10)});
    
    //when - "quando acontecer"
    const response = await request('http://localhost:3000/posts', 'get');
    expect(response.status).toBe(200);                                                          //(REST) - Espera que o código de retorno seja 200 (SUCESSES)
    const posts = response.data;
   
    //then - "entao"
    expect(posts).toHaveLength(3)

    // (DELETA OS DADOS INSERIDOS NO FINAL DO TESTE USANDO O RETORNO DO SAVEPOSTS)
    await postsService.deletePost(post1.id);
    await postsService.deletePost(post2.id);
    await postsService.deletePost(post3.id);
});

test('Should save a post', async function(){
    
    const data = { title: generate(6), content: generate(10)};                                  //cria um objeto post
    
    const response = await request('http://localhost:3000/posts', 'post', data);                //enviar a requisição com o objeto data para o Banco de dados
    expect(response.status).toBe(201)                                                           //(REST) - Espera que o código de retorno seja 201 (CREATED)
    const post = response.data;                                                                 //post recebe o conteúdo da resposta do returning do Banco de Dados
    
    expect(post.title).toBe(data.title)                                                         //verifica se o Title do post confere com a resposta do banco de dados que retornou em data.title
    expect(post.content).toBe(data.content)                                                     // ''
   
    await postsService.deletePost(post.id);                                                     //deleta o post salvo no banco.
});

test('Should not save a post', async function(){
    
    const data = { title: generate(6), content: generate(10)};                                  //cria um objeto post
    
    const response1 = await request('http://localhost:3000/posts', 'post', data);               //enviar duas requisições iguas para o Banco de dados
    const response2 = await request('http://localhost:3000/posts', 'post', data);
    expect(response2.status).toBe(409);                                                         //(REST) - Espera que o código de retorno seja 409 (CONFLICT)
    
    const post = response1.data;                                                                
    await postsService.deletePost(post.id);                                                     //deleta o post da primeira requisicao que foi salvo no banco.
});

test('Should update a post', async function(){
    
    const post = await postsService.savePost({ title: generate(6), content: generate(10)});      //Insere um post aleatório no banco de dados

    post.title = generate(6);                                                                    //Modifica o title do post (mas ainda não no banco)
    post.content = generate(10);                                                                 //''

    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);       //enviar a requisição com o objeto para alterar o post no Banco de dados
    expect(response.status).toBe(204);                                                           //(REST) - Espera que o código de retorno seja 204 (NO CONTENT)
    const updatedPost = await postsService.getPost(post.id);                                     //Pega o post recem modificado no banco
        
    expect(updatedPost.title).toBe(post.title);                                                  //verifica se o title do updatedPost é igual ao que foi enviado para o banco alterar
    expect(updatedPost.content).toBe(post.content);                                              // ''    
   
    await postsService.deletePost(post.id);                                                      //deleta o post salvo no banco.
});

test('Should not update a post', async function(){
    
    const post = {
        id: 1
    };
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);       //enviar a requisição com o objeto para alterar o post no Banco de dados
    expect(response.status).toBe(404);                                                           //(REST) - Espera que o código de retorno seja 204 (NO CONTENT)
});

test('Should delete a post', async function(){
    
    const post = await postsService.savePost({ title: generate(6), content: generate(10)});      //Insere um post aleatório no banco de dados

    const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete');          //enviar a requisição com o ID para deletar o post no Banco de dados
    expect(response.status).toBe(204);                                                           //(REST) - Espera que o código de retorno seja 204 (NO CONTENT)

    const posts = await postsService.getPosts();                                                 //Busca por todos os posts do banco
    expect(posts).toHaveLength(0);                                                               //Verificar se existem 0 posts.
});
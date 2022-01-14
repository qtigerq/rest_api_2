TEST -> ROUTE -> SERVICE -> DATA

Route: A porta de entrada do sistema. Vai armazenas as rotas que vão tratar as requisições que chegarem e repassar para outras camadas da aplicação e retornar a resposta pro quem chamou.
Data: Deixa a camada Service ser mais genérica pois contém todas as querys do banco de dados. Facilita usar o service com outro banco por exemplo.
Infra: Gerencia a conexão com o Banco de Dados.
Test: Separa os testes automatizados do sistema.
# Zanini-Chamados Backend

Backend inicial da API **Zanini-Chamados**, criado com Node.js, Express e MySQL. A estrutura separa rotas, controllers, services, models, middlewares e configuracoes para facilitar crescimento futuro.

## Tecnologias

- Node.js 18+
- Express
- MySQL
- mysql2
- JWT
- bcrypt
- dotenv
- cors
- nodemon

## Estrutura

```text
.
|-- database/
|   `-- init.sql
|-- src/
|   |-- config/
|   |   |-- database.js
|   |   `-- env.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- clientController.js
|   |   |-- healthController.js
|   |   `-- ticketController.js
|   |-- middlewares/
|   |   |-- authMiddleware.js
|   |   |-- errorHandler.js
|   |   `-- notFoundHandler.js
|   |-- models/
|   |   |-- adminModel.js
|   |   |-- clientModel.js
|   |   `-- ticketModel.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- clientRoutes.js
|   |   |-- healthRoutes.js
|   |   |-- index.js
|   |   `-- ticketRoutes.js
|   |-- services/
|   |   |-- authService.js
|   |   |-- clientService.js
|   |   `-- ticketService.js
|   `-- app.js
|-- .env.example
|-- .gitignore
|-- package-lock.json
|-- package.json
|-- README.md
`-- server.js
```

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Ajuste as variaveis do banco no `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=zanini_chamados
JWT_SECRET=troque_este_segredo_em_producao
JWT_EXPIRES_IN=8h
BCRYPT_SALT_ROUNDS=10
```

4. Execute o script SQL inicial:

```bash
npm run db:init
```

Tambem e possivel executar manualmente o arquivo `database/init.sql` no MySQL Workbench, DBeaver ou outro cliente MySQL.

## Rodando o projeto

Ambiente de desenvolvimento:

```bash
npm run dev
```

Ambiente normal:

```bash
npm start
```

Por padrao, a API sobe em:

```text
http://localhost:3000/api
```

## Rotas da API

### Rotas publicas

```http
GET /api/health
POST /api/auth/register
POST /api/auth/login
```

`GET /api/health` retorna o status da API e valida uma consulta simples no banco.

Cadastro de admin:

```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "Admin Zanini",
  "email": "admin@zanini.com.br",
  "senha": "senha123"
}
```

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@zanini.com.br",
  "senha": "senha123"
}
```

As respostas de cadastro e login retornam o admin sem a senha e um token JWT:

```json
{
  "data": {
    "admin": {
      "id": 1,
      "nome": "Admin Zanini",
      "email": "admin@zanini.com.br",
      "created_at": "2026-05-23T00:00:00.000Z",
      "updated_at": "2026-05-23T00:00:00.000Z"
    },
    "token": "jwt..."
  }
}
```

### Rotas protegidas

As rotas de clientes e chamados exigem o header:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### Chamados

```http
GET /api/chamados
GET /api/chamados/:id
POST /api/chamados
PATCH /api/chamados/:id/status
```

Exemplo de criacao:

```json
{
  "clienteNome": "Maria Silva",
  "clienteTelefone": "(11) 99999-9999",
  "clienteEmail": "maria@email.com",
  "equipamento": "Ar-condicionado split 12000 BTUs",
  "descricao": "Equipamento nao esta resfriando corretamente.",
  "prioridade": "alta",
  "tecnicoResponsavel": "Joao"
}
```

Valores aceitos para `prioridade`:

```text
baixa, media, alta, urgente
```

Valores aceitos para `status`:

```text
aberto, em_andamento, aguardando_cliente, concluido, cancelado
```

### Clientes

```http
GET /api/clientes
GET /api/clientes/:id
POST /api/clientes
PUT /api/clientes/:id
DELETE /api/clientes/:id
```

Campos do cliente:

```text
id, nome, telefone, email, endereco, cidade, observacoes, created_at, updated_at
```

`nome` e `telefone` sao obrigatorios em criacao e atualizacao.

Exemplo de criacao:

```json
{
  "nome": "Maria Silva",
  "telefone": "(11) 99999-9999",
  "email": "maria@email.com",
  "endereco": "Rua das Flores, 123",
  "cidade": "Sao Paulo",
  "observacoes": "Atendimento preferencial no periodo da tarde."
}
```

Exemplo de atualizacao:

```json
{
  "nome": "Maria Silva",
  "telefone": "(11) 98888-7777",
  "email": "maria@email.com",
  "endereco": "Rua das Flores, 456",
  "cidade": "Sao Paulo",
  "observacoes": "Cliente solicitou retorno por telefone."
}
```

## Testes manuais no Thunder Client ou Postman

Antes de testar, configure o `.env`, execute `npm run db:init` e suba a API com `npm run dev`.

1. Registrar admin:

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nome": "Admin Zanini",
  "email": "admin@zanini.com.br",
  "senha": "senha123"
}
```

2. Fazer login e copiar o token retornado:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@zanini.com.br",
  "senha": "senha123"
}
```

3. Listar clientes:

```http
GET http://localhost:3000/api/clientes
Authorization: Bearer SEU_TOKEN_JWT
```

4. Buscar cliente por ID:

```http
GET http://localhost:3000/api/clientes/1
Authorization: Bearer SEU_TOKEN_JWT
```

5. Criar cliente:

```http
POST http://localhost:3000/api/clientes
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT

{
  "nome": "Joao Souza",
  "telefone": "(11) 97777-6666",
  "email": "joao@email.com",
  "endereco": "Av. Central, 100",
  "cidade": "Sao Paulo",
  "observacoes": "Cliente novo."
}
```

6. Atualizar cliente:

```http
PUT http://localhost:3000/api/clientes/1
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT

{
  "nome": "Joao Souza",
  "telefone": "(11) 95555-4444",
  "email": "joao@email.com",
  "endereco": "Av. Central, 200",
  "cidade": "Sao Paulo",
  "observacoes": "Cadastro atualizado."
}
```

7. Deletar cliente:

```http
DELETE http://localhost:3000/api/clientes/1
Authorization: Bearer SEU_TOKEN_JWT
```

8. Validar erro de campos obrigatorios:

```http
POST http://localhost:3000/api/clientes
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT

{
  "nome": "",
  "telefone": ""
}
```

Resposta esperada: status `400` com a mensagem `nome e telefone sao obrigatorios.`

## Arquitetura

- `server.js`: inicia o servidor e testa a conexao com o MySQL.
- `src/app.js`: configura Express, CORS, JSON parser, rotas e middlewares globais.
- `src/config`: centraliza variaveis de ambiente e conexao com banco.
- `src/routes`: define os endpoints e encaminha para controllers.
- `src/controllers`: recebe requisicoes HTTP e devolve respostas.
- `src/services`: concentra regras de negocio e validacoes.
- `src/models`: executa consultas no banco de dados.
- `src/middlewares`: autentica requisicoes, trata erros e rotas inexistentes.

## Proximos passos sugeridos

- Criar migrations versionadas.
- Adicionar validacao com Joi, Zod ou Yup.
- Criar testes automatizados.
- Implementar paginacao e filtros em `GET /api/chamados`.
- Separar logs estruturados para producao.

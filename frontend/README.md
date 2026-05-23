# Frontend Zanini Ar Condicionado

Painel administrativo em HTML, CSS e JavaScript puro para a Zanini Ar Condicionado consumir a API de clientes e chamados tecnicos.

## Como abrir

1. Suba o backend em `http://localhost:3000`.
2. Abra a pasta `frontend` com Live Server.
3. Acesse o `index.html` pelo navegador.

Tambem e possivel abrir diretamente o arquivo `frontend/index.html`, mas o Live Server deixa a experiencia mais proxima do uso real.

## Integracao com o backend

O frontend consome a API em:

```text
http://localhost:3000/api
```

O arquivo `js/api.js` centraliza as chamadas `fetch` e adiciona automaticamente:

```http
Authorization: Bearer TOKEN_JWT
```

O token e salvo no `localStorage` apos login ou cadastro de admin, usando a chave:

```text
zanini_chamados_token
```

## Como testar login

1. Abra a tela inicial.
2. Para o primeiro acesso, clique em `Criar admin`.
3. Informe nome, email e senha.
4. Apos criar, o painel abre automaticamente.
5. Para proximos acessos, use a aba `Entrar` com o mesmo email e senha.

## Fluxo completo

1. O usuario faz login em `/api/auth/login`.
2. O token JWT fica salvo no navegador.
3. O dashboard carrega clientes e chamados tecnicos protegidos.
4. A area de clientes permite listar, criar, editar e excluir cadastros da base de atendimento.
5. A area de chamados permite listar, filtrar, criar e alterar status de instalacoes, manutencoes, higienizacoes e assistencias tecnicas.
6. Ao criar um chamado tecnico, o cliente pode ser selecionado da base cadastrada; o frontend preenche nome, telefone e email para manter compatibilidade com a API atual.
7. O logout remove o token e bloqueia o painel.

## Estrutura

```text
frontend/
|-- assets/
|   `-- zanini-mark.svg
|-- components/
|   |-- layout.js
|   |-- modal.js
|   `-- toast.js
|-- css/
|   `-- styles.css
|-- js/
|   |-- api.js
|   |-- app.js
|   |-- config.js
|   |-- storage.js
|   `-- utils.js
|-- pages/
|   |-- chamados.js
|   |-- clientes.js
|   |-- dashboard.js
|   `-- login.js
|-- index.html
`-- README.md
```

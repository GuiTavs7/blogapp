# BlogApp

Aplicação de blog desenvolvida com Node.js, Express, MongoDB, Mongoose e Handlebars. O projeto permite cadastrar usuários, autenticar usuários, criar postagens, organizar postagens por categorias e fazer upload de imagens para o Cloudinary.

## Aplicação online

Acesse a versão hospedada no Render:

👉 [BlogApp](https://blogapp-wh9i.onrender.com)

## Funcionalidades

- Página inicial com as postagens mais recentes.
- Visualização de uma postagem completa por slug.
- Listagem de categorias.
- Listagem de postagens por categoria.
- Cadastro, login e logout de usuários.
- Senhas armazenadas com hash usando bcryptjs.
- Criação de postagens por usuários autenticados.
- Painel administrativo para gerenciar categorias e postagens.
- Upload de imagens para o Cloudinary.
- Exibição responsiva das imagens.
- Mensagens de sucesso e erro com `connect-flash`.
- Sessão de usuário com `express-session`.

## Tecnologias utilizadas

- Node.js: ambiente de execução JavaScript no servidor.
- Express: framework HTTP usado para criar o servidor, middlewares e rotas.
- MongoDB: banco de dados NoSQL que armazena usuários, categorias e postagens.
- MongoDB Atlas: opção de banco MongoDB hospedado na nuvem.
- Mongoose: ODM usado para conectar ao MongoDB e definir os modelos.
- Handlebars: engine de templates usada para renderizar as páginas HTML.
- Bootstrap: biblioteca CSS usada no layout responsivo e nos componentes visuais.
- Cloudinary: serviço externo usado para armazenar e entregar imagens de forma persistente.
- Passport: middleware de autenticação.
- Passport Local: estratégia de login usando e-mail e senha.
- bcryptjs: gera e compara hashes de senhas.
- express-session: cria e administra sessões no servidor.
- connect-flash: armazena mensagens temporárias entre redirecionamentos.
- body-parser: interpreta dados enviados em formulários e requisições JSON.
- dotenv: carrega variáveis do arquivo `.env` para `process.env`.
- Multer: processa formulários `multipart/form-data` e arquivos enviados.
- multer-storage-cloudinary: integra o Multer ao armazenamento do Cloudinary.
- cloudinary: SDK usado para configurar e enviar imagens ao Cloudinary.

## Requisitos

- Node.js instalado.
- npm instalado.
- MongoDB local ou uma conta no MongoDB Atlas.
- Conta no Cloudinary para uploads persistentes.

## Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone URL_DO_REPOSITÓRIO
cd blogapp
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto. Nunca publique esse arquivo em repositórios públicos.

### Desenvolvimento local

```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/blogapp
ADMIN_EMAIL=seu-email@example.com

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

No ambiente de desenvolvimento, o arquivo `config/db.js` usa o MongoDB local. O `MONGO_URI` também é usado pelo script de criação de administrador.

### Produção no Render

No painel do serviço no Render, adicione as mesmas variáveis em **Environment**:

```env
NODE_ENV=production
MONGO_URI=sua_connection_string_do_mongodb_atlas
ADMIN_EMAIL=seu-email@example.com
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

O Render deve executar o comando de inicio:

```bash
npm start
```

A aplicação usa a porta fornecida pelo Render por meio de `process.env.PORT`. Localmente, usa a porta `8081` quando nenhuma porta e informada.

## Como executar

Inicie a aplicação:

```bash
npm start
```

Acesse:

```text
http://localhost:8081
```

Durante o desenvolvimento, pode ser usado um monitor de arquivos como o Nodemon, caso esteja instalado no ambiente:

```bash
npx nodemon app.js
```

O Nodemon apenas reinicia o processo Node.js. Ele não oferece armazenamento persistente para arquivos.

## Criando um administrador

Primeiro, cadastre um usuário normalmente pela página de registro. Depois, confirme que `ADMIN_EMAIL` corresponde ao e-mail desse usuário e execute:

```bash
npm run admin
```

O script `scripts/criarAdmin.js` localiza o usuário pelo e-mail definido em `ADMIN_EMAIL` e altera `isAdmin` para `true`.

## Rotas principais

### Páginas públicas

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/` | Exibe as postagens mais recentes. |
| GET | `/postagem/:slug` | Exibe uma postagem completa. |
| GET | `/categorias` | Lista as categorias cadastradas. |
| GET | `/categorias/:slug` | Lista as postagens de uma categoria. |
| GET | `/404` | Exibe a pagina de erro. |

### Usuários

As rotas abaixo usam o prefixo `/usuarios`:

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/usuarios/registro` | Exibe o formulário de cadastro. |
| POST | `/usuarios/registro` | Cria um novo usuário. |
| GET | `/usuarios/login` | Exibe o formulário de login. |
| POST | `/usuarios/login` | Autentica o usuário. |
| GET | `/usuarios/logout` | Encerra a sessão. |
| GET | `/usuarios/postagens/add` | Exibe o formulário de nova postagem para usuário logado. |
| POST | `/usuarios/postagens/nova` | Cria uma postagem para usuário logado. |

### Administração

As rotas administrativas usam o prefixo `/admin` e exigem usuário autenticado com `isAdmin: true`.

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/admin/categorias` | Lista categorias. |
| GET | `/admin/categorias/add` | Exibe o formulário de categoria. |
| POST | `/admin/categorias/nova` | Cria uma categoria. |
| GET | `/admin/categorias/edit/:id` | Exibe a edição de uma categoria. |
| POST | `/admin/categorias/edit/:id` | Atualiza uma categoria. |
| POST | `/admin/categorias/delete/:id` | Exclui uma categoria. |
| GET | `/admin/postagens` | Lista postagens. |
| GET | `/admin/postagens/add` | Exibe o formulário de postagem. |
| POST | `/admin/postagens/nova` | Cria uma postagem administrativa. |
| GET | `/admin/postagens/edit/:id` | Exibe a edição de uma postagem. |
| POST | `/admin/postagens/edit/:id` | Atualiza uma postagem. |
| POST | `/admin/postagens/delete/:id` | Exclui uma postagem. |

## Banco de dados

O banco possui as seguintes coleções principais:

- `usuarios`: nome, e-mail, hash da senha e permissão de administrador.
- `Categorias`: nome, slug e data de criação.
- `postagens`: título, slug, descrição, imagem, conteúdo, categoria e data.

O campo `categoria` das postagens referencia um documento da coleção `Categorias`.

O campo `imagem` é uma string. Para novos uploads, essa string contém a URL completa do Cloudinary, por exemplo:

```text
https://res.cloudinary.com/seu_cloud_name/image/upload/...
```

## Upload de imagens

Os uploads sao processados por `multer` e enviados ao Cloudinary usando `multer-storage-cloudinary`.

Configurações atuais:

- Pasta no Cloudinary: `blogapp`.
- Formatos aceitos: JPG, JPEG, PNG e GIF.
- Tamanho máximo: 5 MB.
- O banco salva a URL retornada pelo Cloudinary.

A pasta local `public/uploads` não é necessária para novos uploads. O armazenamento local do Render é efêmero, por isso não deve ser usado como local definitivo para imagens em produção.

Imagens antigas que tenham apenas o nome do arquivo no MongoDB, em vez de uma URL do Cloudinary, ainda dependem do arquivo local original. Elas devem ser migradas ou reenviadas antes de remover a pasta local.

## Estrutura de pastas

```text
blogapp/
|-- app.js                  # Inicialização do Express, middlewares e rotas públicas
|-- package.json            # Dependências e scripts npm
|-- config/
|   |-- auth.js             # Estratégia Passport Local e sessões de usuário
|   |-- db.js               # Escolha da conexão Mongo local ou Atlas
|   |-- upload.js           # Configuração do Multer com Cloudinary
|-- helpers/
|   |-- estaLogado.js       # Protege rotas que exigem login
|   |-- formatarData.js     # Formata datas para pt-BR
|   |-- isAdmin.js          # Protege rotas administrativas
|-- models/
|   |-- Categoria.js        # Modelo de categoria
|   |-- Postagem.js         # Modelo de postagem
|   |-- Usuario.js          # Modelo de usuário
|-- routes/
|   |-- admin.js            # Rotas administrativas
|   |-- usuario.js          # Registro, login e postagens de usuários
|-- scripts/
|   |-- criarAdmin.js       # Promove um usuário a administrador
|-- public/
|   |-- css/                # Bootstrap e estilos da aplicação
|   |-- js/                 # JavaScript do Bootstrap
|   |-- img/                # Imagens estáticas
|-- views/
|   |-- layouts/            # Layout principal
|   |-- partials/           # Componentes reutilizáveis
|   |-- admin/              # Views administrativas
|   |-- categorias/         # Views de categorias
|   |-- postagem/           # View detalhada da postagem
|   |-- usuarios/           # Views de cadastro, login e postagem
|-- .env                   # Variáveis locais; nao deve ser versionado
|-- .gitignore              # Arquivos ignorados pelo Git
```

## Autenticação e autorização

O cadastro cria um usuário com `isAdmin: false`. A senha não é salva em texto puro: ela passa pelo `bcryptjs` antes de ser persistida.

O Passport Local procura o usuário pelo campo `email` e compara a senha informada com o hash armazenado. Depois do login, o Passport grava o identificador do usuário na sessão.

- `estaLogado.js`: permite o acesso apenas a usuários autenticados.
- `isAdmin.js`: permite o acesso apenas a usuários autenticados com `isAdmin` verdadeiro.

## Handlebars

O layout padrão está em `views/layouts/main.handlebars`. O helper global `formatarData` pode ser usado nas views assim:

```handlebars
{{formatarData postagem.data}}
```

O helper retorna a data no formato brasileiro com data e horário. Quando não recebe uma data, retorna `Data não informada`.

## Scripts npm

| Comando | Função |
| --- | --- |
| `npm start` | Inicia a aplicação com `node app.js`. |
| `npm run admin` | Promove o usuario de `ADMIN_EMAIL` a administrador. |
| `npm test` | Atualmente é apenas um placeholder e não executa testes automatizados. |

## Segurança

- Nunca commite `.env`.
- Nunca publique `CLOUDINARY_API_SECRET`, senhas ou a string de conexão do MongoDB.
- Se uma credencial for exposta, revogue-a e gere outra no serviço correspondente.
- Use variáveis de ambiente no Render e em outros ambientes de produção.
- Em produção, prefira uma chave do Cloudinary com permissões limitadas ao uso da aplicação.

## Observações

- O projeto ainda não possui uma suíte de testes automatizados.
- A sessão usa um segredo definido diretamente em `app.js`; em produção, o ideal é mover esse segredo para uma variável de ambiente.
- O banco local é selecionado quando `NODE_ENV` não é `production`; em produção, a conexão vem de `MONGO_URI`.
- O projeto pode ser publicado no Render usando `npm install` na instalação e `npm start` na inicialização.

## Licença

O `package.json` declara a licença ISC.
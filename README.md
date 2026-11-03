# BStudent

Sistema de bolsas de estudo e mentorias pagas.

**Tecnologias:** React + TypeScript · Node.js + Express + TypeScript · PostgreSQL

```text
BStudent/
├── backend/    API REST (routes → controllers → services → PostgreSQL)
├── frontend/   React + Vite
└── database/   migrations/ e seeds/ do PostgreSQL
```

## Requisitos

- Node.js e npm.
- PostgreSQL instalado e em execução.
- pgAdmin 4 é opcional: pode ser utilizado para administrar visualmente o PostgreSQL, mas não é necessário para executar o BStudent.

> Este procedimento foi testado no ambiente de desenvolvimento Linux Mint 22.2, com PostgreSQL 16.15. Os comandos de instalação do PostgreSQL podem variar noutras distribuições.

## Convenção do frontend

Cada componente e cada página tem a sua pasta, com `index.tsx` e `style.css`.
Por isso as importações não levam o nome do ficheiro:

```ts
import Navbar from "./components/Navbar";   // components/Navbar/index.tsx
import Home from "./pages/Home";            // pages/Home/index.tsx
```

## Como executar localmente

Siga os passos pela ordem indicada.

### 1. Confirmar que o PostgreSQL está em execução

No terminal:

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
pg_lsclusters
```

Confirme que o cluster PostgreSQL apresenta o estado `online` e que está a utilizar a porta `5432`.

### 2. Criar a base de dados

No Linux, o comando simples `createdb bstudent` tenta utilizar automaticamente o nome do utilizador do sistema operativo como utilizador PostgreSQL. Se esse papel não existir no PostgreSQL, poderá surgir o erro `role "<utilizador-linux>" does not exist`.

Para criar a base de dados utilizando a conta administrativa local `postgres`, execute:

```bash
sudo -u postgres createdb bstudent
```

Para confirmar que a base de dados foi criada:

```bash
sudo -u postgres psql -l
```

Também pode atualizar a lista **Databases** no pgAdmin 4 para visualizar a base de dados `bstudent`.

### 3. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
```

Crie o ficheiro de ambiente local a partir do exemplo:

```bash
cp .env.example .env
```

Edite o ficheiro `.env`:

```bash
nano .env
```

Configure as variáveis. Exemplo para desenvolvimento local:

```env
PORT=3333
DATABASE_URL=postgres://postgres:SUA_PALAVRA_PASSE@localhost:5432/bstudent
JWT_SECRET=COLOQUE_UM_SEGREDO_LONGO_E_ALEATORIO
PAYMENT_WEBHOOK_SECRET=COLOQUE_OUTRO_SEGREDO_LONGO_E_ALEATORIO
CLIENT_URL=http://localhost:5173
```

Substitua `SUA_PALAVRA_PASSE` pela palavra-passe definida para o utilizador PostgreSQL `postgres`. Não inclua os sinais `<` ou `>`.

Se a palavra-passe tiver caracteres reservados numa URL (por exemplo `@`, `:`, `/`, `#` ou `%`), codifique esses caracteres em formato URL antes de os colocar na `DATABASE_URL`.

Gere segredos aleatórios para desenvolvimento com:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Utilize um resultado para `JWT_SECRET` e o outro para `PAYMENT_WEBHOOK_SECRET`. Não partilhe nem publique o ficheiro `.env`; mantenha-o fora do controlo de versões.

Instale as dependências:

```bash
npm install
```

### 4. Aplicar as migrations

Ainda dentro da pasta `backend`, execute:

```bash
npm run migrate
```

Este comando aplica as migrations existentes à base de dados `bstudent`.

### 5. Inserir dados de demonstração

Depois de as migrations terminarem sem erros, execute:

```bash
npm run seed
```

Este comando insere as categorias e os dados de demonstração previstos pelo projeto.

### 6. Iniciar o backend

Na pasta `backend`, execute:

```bash
npm run dev
```

Mantenha este terminal aberto enquanto estiver a utilizar a aplicação.

O backend deverá ficar disponível em:

```text
http://localhost:3333/api
```

### 7. Instalar e iniciar o frontend

Abra um **segundo terminal**. A partir da pasta principal do projeto, execute:

```bash
cd frontend
npm install
npm run dev
```

Mantenha também este terminal aberto.

O frontend deverá ficar disponível em:

```text
http://localhost:5173
```

O Vite está configurado para encaminhar os pedidos feitos através de `/api` para o backend na porta `3333`.

### 8. Abrir e testar a aplicação

Abra o navegador em:

```text
http://localhost:5173
```

Contas de demonstração, disponíveis após `npm run seed`:

| Perfil | Email | Palavra-passe |
|---|---|---|
| Administrador | `admin@bstudent.com` | `Admin12345` |
| Candidato | `candidato@bstudent.com` | `Candidato12345` |
| Mentor | `mentor@bstudent.com` | `Mentor12345` |

Estas credenciais são apenas para desenvolvimento e demonstração. Altere-as ou remova-as antes de disponibilizar o sistema publicamente.

## Utilizar o pgAdmin 4 (opcional)

O pgAdmin 4 permite administrar o PostgreSQL através de uma interface gráfica. A aplicação BStudent não depende dele para funcionar.

Para registar o servidor local no pgAdmin:

1. Abra o pgAdmin 4.
2. Clique com o botão direito em **Servers** e escolha **Register → Server**.
3. No separador **General**, defina o nome `PostgreSQL Local`.
4. No separador **Connection**, preencha:

| Campo | Valor |
|---|---|
| Host name/address | `localhost` |
| Port | `5432` |
| Maintenance database | `postgres` |
| Username | `postgres` |
| Password | A palavra-passe do utilizador `postgres` |

5. Se desejar, ative **Save password?** e clique em **Save**.
6. Expanda o servidor e atualize **Databases** para visualizar `bstudent`.

## Parar os servidores

Para parar o backend ou o frontend, volte ao respetivo terminal e pressione:

```text
Ctrl + C
```

O PostgreSQL é um serviço separado e pode continuar em execução.

## Scripts disponíveis no backend

- `npm run dev`: inicia o backend em modo de desenvolvimento.
- `npm run build`: compila o TypeScript.
- `npm start`: inicia a versão compilada.
- `npm run migrate`: aplica as migrations.
- `npm run seed`: insere dados de demonstração.

## Regras de negócio no código

- RN08/RN12: `applications.service.submit` não consulta pagamentos; a candidatura é independente.
- RN11/RN13: a contratação só passa a `ativa` em `contracts.service.processPaymentEvent`, chamado pelo webhook
  `POST /api/payments/webhook` (assinatura HMAC-SHA256 no cabeçalho `x-signature`, valor verificado, idempotente).
- Em desenvolvimento, `POST /api/payments/dev-simulate` imita o gateway; está desativado em produção.
- Recomendações (`recommendations.service`): pesos 40/25/15/20; bolsas cujo nível académico não coincide com o do
  candidato são excluídas (requisito formal), não apenas penalizadas.

## Por fazer antes de produção

- Integrar o gateway de pagamento real (trocar `dev-simulate` pelo fluxo do fornecedor e ajustar o formato do webhook).
- Armazenamento de documentos: hoje a candidatura guarda apenas nome e tamanho dos ficheiros (JSONB).
  Falta o upload para armazenamento privado com controlo de acesso.
- Gestão de utilizadores/categorias e de sessões/disponibilidade do mentor (previstas no documento) ainda não têm ecrãs.
- Testes automatizados (API, permissões, pagamentos).
- Moeda: `CURRENCY` em `frontend/src/utils/format.ts` (por omissão AOA).

# Testes automatizados 🧪

## O que são testes automatizados?

São testes executados por código para verificar se um sistema funciona corretamente, sem a necessidade de testes manuais.

## Por que usá-los?

✅ Evita erros → Detecta problemas antes que afetem os usuários.  
✅ Economiza tempo → Automatiza tarefas repetitivas.  
✅ Garante qualidade → Mantém o código funcionando após mudanças.  
✅ Facilita manutenção → Ajuda a evitar que novas funcionalidades quebrem o sistema.

## Instalando pacote

Nesta seção vamos utilizar o `jest` para realizar os testes, para isso digite no terminal

    npm i jest --save-de

agora dentro do package.json, dentro do objeto _script_ adicione

```json
script: {
    "start": "node src/index.js",
    "dev":"env-cmd ./config/dev.env nodemon src/index.js",
    "test":"jest"
}
```

No terminal vamos executar nossos testes usando o comando:

    npm test

vamos obter um erro no terminal pois ainda não criamos uma arquivo de teste. Para fazer isso, crie uma nova pasta no diretório `src` chamada `tests` e dentro adicione arquivos com nome como:

    math.test.js

Em função da extensão do arquivo o jest será capaz de encontrar o arquivo para testar.

Aqui vamos começar com testes simples, veja o exemplo abaixo:

```javascript
test("Olá, Mundo!", () => {
  // Se deixamos vazio e rodarmos o test não dará erro
});

test("Esse test vai falhar", () => {
  // Esse teste vai falhar
  throw new Errro("Falhar!");
});
```

Agora crie um arquivo externo `math.js` onde adicionamos a função:

```javascript
function sum(num1, num2) {
  return num1 + num2;
}

module.exports = {
  sum,
};
```

é uma função simples mas vai servir para nossos testes iniciais. Agora dentro do nosso arquivo `math.test.js` vamos importar a função acima e usar `sum` nos nossos testes.

```javascript
const { sum } = require("./math");

// Teste 1
test("obter soma", () => {
  const soma = sum(1, 2);
  expect(soma).toBe(3);
});

// Teste 2
test("Nome deve ser igor", () => {
  const name = "Alan";
  expect(name).toBe("igor");
});
```

## Testando códigos assincronos

Antes de começar a aprender como fazer testes em códigos assincronos, devemos alterar o arquivo `package.json` para que os testes sejam executados automaticamente sem precisar executar manualmente os testes no terminal Para isso, fazemos

```json
script: {
    "start": "node src/index.js",
    "dev":"env-cmd ./config/dev.env nodemon src/index.js",
    "test":"jest --watch"
}
```

pronto, agora os testes serão executados automaticamente a medida que alteremos os arquivos de teste e salvamos. Rode no terminal o `npm run test` e veja que o terminal não é mais liberado após a execução.

Vamos iniciar nossos testes, veja o código abaixo:

```javascript
test("Async Demo", () => {
  setTimeOut(() => {
    expect(1).toBe(2);
  }, 2000);
});
```

se salvarmos o código acima veremos que o não teremos nenhum erro, o que claramente é um erro, pois `expect(1).toBe(2);` está errado. Isso acontece pq o jest não sabe que o código em questão se trata de um código assincrono. Para resolver isso, precisamos dizer ao jest para finalizar o teste, somente quando tudo estiver feito(done), ou seja:

```javascript
test("Async Demo", (done) => {
  setTimeOut(() => {
    expect(1).toBe(2);
    done();
  }, 2000);
});
```

quando o `setTimeOut` terminar de executar, o método `done()` será executado e o jest finalizará os testes com os resultados. Se olhar no terminal agora veremos um erro, o que era o resultado esperado.

Vamos adicionar um outra função ao nossos testes para tornar as coisas um pouco mais dificeis. Veja o código abaixo:

```javascript
function sum(num1, num2) {
  return num1 + num2;
}

const add = (a, b) => {
  return new Promise(resolve, (reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        console.log("Numbers must be non-negative");
      }

      resolve(a + b);
    }, 2000);
  });
};

module.exports = {
  sum,
  add,
};
```

adicionamos a função `add` que é assicrona para trabalhar melhor com processos assincronos. Agora vamos iniciar nossos testes. Como a função `add` é assincrona, então usamos o `then()` para resolver a promisse. Uma vez resolvida, usamos o retorno para executar nossos testes da mesma forma que fizemos até aqui.

```javascript
test("obter a soma de dois números", (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});
```

podemos escrever o código acima usando `async/await`, que é mais usado e fica como:

```javascript
test("obter a soma de dois números", async () => {
  const sum = await add(1, 2);
  expect(sum).toBe(3);
});
```

## Testando aplicação express part I

Nesta seção alguns arquivos serão modificados, uma vez que serão usados para executar testes dentro de uma API. A primeira alteração a ser feita é no arquivo .env, aqui será criado outro arquivo com o nome `teste.env` onde será adicionado uma copia dos dados do arquivo `.env`. Os testes executado pelo jest na nossa API, afeta a base de dados, uma vez que os testes são como solicitações reais a nossa API. Esse não é o comportamento desejado, em função disso, vamos usar uma base de dados local para executar os testes dentro da nossa API. No `teste.env` adicione:

    DB_URL= mongodb://127.0.0.1:27017/auth

Lembrando que possivelmente haverá outras variáveis de ambiente dentro do arquivo `.env`, as mantenham como estão, altere somente a base de dados na URL.

Como os testes serão executados usando o arquivo `teste.env` vamos configurar o jest para usar esse arquivo.

Primeiro, vamos instalar o pacote `env-cmd` digitando no terminal:

    npm i env-cmd --save-dev

agora, dentro do package.json altere os dados para:

```json
"scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
    "test": "env-cmd -f test.env jest --watch"
  },
  "jest": {
    "testEnvironment": "node"
  },
```

Agora quando for executar nossos testes, é só digitar npm test no terminal.

## Testando aplicação express part II

Aqui antes de iniciar o teste vamos instalar um novo pacote do node, chamado supertest:

    npm i supertest

Uma outra alteração que devemos fazer é na estrutura do nosso servidor, uma vez que o jest executa testes sem que o servidor esteja rodando, dado que ao iniciar o servidor ele bloqueia a porta onde é feita os testes. Para evitar comportamentos indesejados, vamos criar na raiz do projeto vamos criar um arquivo chamado `app.js`, onde vamos adicionar o parte do código que está dentro do `server.js`.

#### server.js

```javascript
const app = require("./app"); // importando outro parte do servidor

// server config
const port = process.env.port || 5000;

// Servidor
app.listen(port, () => {
  console.log("Servidor On");
  console.log(`Acesse em http://localhost:${port}`);
});
```

#### app.js

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

require("./src/db/dbConnection");

// Routes
const routes = require("./src/routes/routes");

// Database Connection
require("./src/db/dbConnection");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bem vindo ao servidor" });
});

app.use(routes);

module.exports = app; // Exportanto para o arquivo server.js
```

Para iniciar nossos testes, vamos importar o app.js dentro do nosso arquivo `users.test.js` que foi criado dentro da pasta /src/test

## Teste 1 - Testando cadastrar usuário na API

```javascript
const request = require("supertest");

const app = require("../app");

test("Deve cadastrar usuário", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "igor",
      email: "igor@gmail.com",
      password: "12346",
    })
    .expect(201);
});
```

Se já houver algum usuário com esses dados cadastrados, o teste lançará um erro.

## Configuração jest e desmontagem

No exemplo acima temos um usuário sendo adicionado à base de dados, se executarmos o mesmo teste mais de uma vez, na segunda execução o teste lançará um erro, uma vez que os testes realizados pelo jest realmente afetam a base de dados, ou seja, o usuário realmente é adicionado na base e quando rodamos o mesmo teste de maneira subsequente, o que ocorre é que nossa API lança um erro, uma vez que o dado que estamos tentando adicionar já existe na base de dados. Para resolver esse problema, devemos desmontar a base de dados após o teste.

```javascript
// Essa função será executada antes de teste
beforeEach(() => {});
```

```javascript
// Essa função será executada antes de teste
afterEach(() => {});
```

podemos executar qualquer lógica dentro dos métodos acima, e elas serão executadas antes e depois de cada teste. Um exemplo de uso comum desses métodos dentro dos nossos testes é o de limpar a base de dados antes ou depois de executar os testes, isso evita que os testes que executamos lancem erros.

```javascript
const User = require("../src/model/userModel");

beforeEach(async () => {
  await User.deleteMany();
});
```

ou

```javascript
const User = require("../src/model/userModel");

afterEach(async () => {
  await User.deleteMany();
});
```

Agora vamos testar a rota de login da nossa aplicação, e se repararmos acima, todos os dados da nossa base são removidos após os testes de `cadastro`, o que é um problema para o caso do teste de login, uma vez que nesse caso, devemos ter um usuário cadastrado na base de dados. Para resolver esse problemas, vamos precisar alterar um pouco nosso código.

```javascript
const request = require("supertest");

const app = require("../app");
const mongoose = require("mongoose");
const User = require("../src/model/userModel");

const user = {
  name: "Paula",
  email: "paula@gmail.com",
  password: "12346",
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(user).save();
});

test("Deve cadastrar usuário", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "igor",
      email: "igor@gmail.com",
      password: "12346",
    })
    .expect(201);
});
```

Agora temos um usuário permanente na base de dados e podemos executar o teste de login, analise o código abaixo

```javascript
const request = require("supertest");

const app = require("../app");
const mongoose = require("mongoose");
const User = require("../src/model/userModel");

const user = {
  userName: "Paula",
  email: "paula@gmail.com",
  password: "12346",
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(user).save();
});

//  Teste rota cadastro ✅
test("Deve cadastrar usuário", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "igor",
      email: "igor@gmail.com",
      password: "12346",
    })
    .expect(201);
});

// Teste de erro rota cadastro ❌
test("Não deve cadastrar usuário", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "i", // Dado inválido
      email: "igor@", // Dado inválido
      password: "12", // Dado inválido
    })
    .expect(201);
});

//  Teste rota Login ✅
test("Deve fazer login usuário", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200);
});

//  Teste de falha rota Login ❌
test("Deve falhar ao realizar login do usuário", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "andre@hotmail.com", // Usuário não cadastrado
      password: user.password,
    })
    .expect(200);
});

afterAll(async () => {
  await mongoose.connection.close(); // Fecha conexão com a base de dados após testes
});
```

## Testando rotas privadas

Rotas privadas são aquelas que os usuários precisam possuir um token para poder acessa-las. Esse token é decodificado e verificado sua validade pelo servidor, de modo que o usuário possa acessar serviços e dados confidenciais associados a sua conta. Os testes executados até o momento foram realizados em rotas públicas, onde não era necessário o usuário possuir um token para poder acessa-las. Entretanto, nos testes subsequentes, as rotas serão privadas e precisaremos adicionar um `Id` à nossa usuária permanente, e com esse Id vamos criar um token de acesso para a usuária.

Utilizamos o mongoose para criar um `ObjectId`, esse dado será o valor do campo `_id` do documento user. Com esse dado obtido, podemos gerar um token para o user usando o método `.sign()` do `jsonwebtoken`, passando o **userOneId** como payload, o **JWT_SECRET** para segredo e o tempo de expiração do token ao final. O processo detalhado pode ser visualizado no código abaixo.

```javascript
const request = require("supertest");

const app = require("../app");
const mongoose = require("mongoose");
const User = require("../src/model/userModel");

const jwt = require("jsonwebtoken");

// Aqui estamos criando o id e associando a usuária permanente
const userOneId = new mongoose.Types.ObjectId();

const user = {
  _id: userOneId,
  userName: "Paula",
  email: "paula@gmail.com",
  password: "12346",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};
```

Agora que nosso usuário possui um token associado, podemos unir os testes as rotas privadas aos testes que já executamos até aqui, com a diferença de que, agora devemos nos atentar aos métodos exigidos em cada um dos testes e no fato de que precisaremos enviar nosso token via método `.set()`. Veja os testes 5 e 6 abaixo.

```javascript
const request = require("supertest");

const app = require("../app");
const mongoose = require("mongoose");
const User = require("../src/model/userModel");

const jwt = require("jsonwebtoken");

// Aqui estamos criando o id e associando a usuária permanente
const userOneId = new mongoose.Types.ObjectId();

const user = {
  _id: userOneId,
  userName: "Paula",
  email: "paula@gmail.com",
  password: "12346",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(user).save();
});

  // 1 - Teste rota cadastro ✅
  test("Deve cadastrar usuário", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "igor",
        email: "igor@gmail.com",
        password: "12346",
      })
      .expect(201);
  });

  // 2 - Teste de erro rota cadastro ❌
  test("Não deve cadastrar usuário", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "i", // Dado inválido
        email: "igor@", // Dado inválido
        password: "12", // Dado inválido
      })
      .expect(201);
  });

  // 3 - Teste rota Login ✅
  test("Deve fazer login usuário", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);
  });

  // 4 - Teste de falha rota Login ❌
  test("Deve falhar ao realizar login do usuário", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "andre@hotmail.com", // Usuário não cadastrado
        password: user.password,
      })
      .expect(200);
  });

 // 5- Teste para obter informações do usuário ✅
  test("Obter dados do perfil do usuário", async () => {
    await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);
  });

  // 6 - Teste de falha da rota de obter dados do usuário ❌
  test('Não deve retornar dados do usuário, token não foi enviado', async () => {
     await request(app)
          .get('/users/profile')
          .set('Authorization', `Bearer ${}`)
          .send()
          .expect(403)
  })

afterAll(async () => {
  await mongoose.connection.close(); // Fecha conexão com a base de dados após testes
});
```

## Teste rota delete

Agora chegou o momento de verificarmos se nossa API está removendo os dados corretamente, para isso, vamos adicionar aos nossos testes, o de número 7 e 8 mostra no código abaixo.

```javascript
// 7 - Teste de remoção da conta do usuário ✅

test("Deve remover o usuário", async () => {
  await request(app)
    .delete("/users/profile")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send()
    .expect(200);
});

// 8 - Teste de falha ao remover da conta do usuário, usuário não autorizado ❌

test("Deve remover o usuário", async () => {
  await request(app)
    .delete("/users/profile")
    .set("Authorization", ``)
    .send()
    .expect(403);
});
```

## Declarações avançadas

Podemos fazer testes mais avançados, verificando se dados foram de fato salvos na base de dados, se o token foi gerado como esperado entre outros, veja alguns exemplos abaixo.

```js
test("Deve cadastrar novo usuário", async () => {
  // Envia uma requisição POST para cadastrar um novo usuário
  const response = await request(app)
    .post("/users/signup")
    .send({
      name: "Andrew",
      email: "andrew@example.com",
      password: "MyPass777!",
    })
    .expect(201); // Espera que o status da resposta seja 201 (Created)

  // Verifica se o usuário foi salvo corretamente no banco de dados
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull(); // O usuário deve existir no banco

  // Verificações sobre a resposta da API
  expect(response.body).toMatchObject({
    user: {
      name: "Andrew",
      email: "andrew@example.com",
    },
    token: user.tokens[0].token, // O token gerado deve ser igual ao armazenado no banco
  });

  // Garante que a senha salva no banco está criptografada
  expect(user.password).not.toBe("MyPass777!");
});
```

## Mocking libraries

No contexto dos testes automatizados, **Mocking Libraries** são bibliotecas usadas para criar objetos simulados que imitam o comportamento de dependências externas, como bancos de dados, APIs ou funções de terceiros. Isso permite testar partes específicas do código sem depender desses serviços externos, tornando os testes mais rápidos, isolados e previsíveis.

Para criar nossos mocks, vamos criar uma pasta chamada `__mocks__` dentro da pasta onde estamos rodando nossos testes.
Dentre da pasta vamos adicionar uma pasta com o nome do modulo que queremos recriar com o @ na frente do nome `@sendgrid`, por exemplo, e dentro dessa pasta vamos adicionar um arquivo.js.

Quando estamos criando um mock de uma api externa é importante garantir que nosso mock tenha exatamente as mesmas funções da Api original. Por exemplo:

```js
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'Igorfonseca@gmail.com',
    subject: 'Thanks for joining in!'
    text: 'Bem vindo a API'
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'Igorfonseca@gmail.com',
    subject: 'Thanks for joining in!'
    text: 'Triste por te ver partir...'
  })
}

```

acima temos um pacote que envia email ao usuário quando ele cria ou remove sua conta. Vamos criar um mock desse pacote para simular o comportamento de enviar email e podermos testar nossa API sem gastar da cota gratuita. Repare que no código acima utilizamos dois métodos, o `setApiKey()` e o `.send()`, e nenhum deles retorna algo. Então será esses dois métodos que vamos simular o comportamento.

Dentro no arquivo.js na pasta dentro de `__mock__` fazemos:

```js
module.exports = {
  setApiKey() {},
  send() {},
};
```

Agora é só criar um test para a rota de criar...

## Teste de rotas com envio de arquivos

Na nossa API, existe a rota onde o usuário deve anexar uma foto para ser usada como foto de perfil, aqui vamos aprender como podemos testar esse tipo de rota enviando uma arquivo em anexo. Para isso vamos criar dentro da pasta `__mocks__` uma nova pasta chamada `fixture`, onde vamos adicionar o arquivo que queremos enviar no teste. Uma vez com esse passo tendo sido feito, vamos escrever o teste como mostrado abaixo.

```js
test("Deve fazer envio de imagem", async () => {
  await request(app)
    .post("/profile/photo")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .attach("profile img", "caminho até a imagem")
    .expect(200);

  const user = await User.findById(userId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});
```

O teste acima é para o caso de estar salvando a imagem de perfil dentro do documento na base de dados, o que não é recomendado. Neste caso devemos usar um serviço externo de armazenamento de imagens e salvar a URL da imagem que o serviço como o Claudinary fornece. Se estiver usando esses serviços para realizar os testes será necessário fazer um mock do `multer` e `cloudinary`. Para o caso do multer podemos fazer algo como:

```js
jest.mock("multer", () => {
  return () => ({
    single: jest.fn(() => (req, res, next) => next()),
    array: jest.fn(() => (req, res, next) => next()),
    fileds: jest.fn(() => (req, res, next) => next()),
  });
});
```

abaixo explico detalhadamente a estrutura do código acima

1️⃣ `jest.mock('multer', () => {...})`
Aqui, estamos dizendo ao Jest para substituir o módulo multer por um mock personalizado.

2️⃣ `return () => ({ ... })`
O multer exporta uma função, então nosso mock precisa imitar isso. Quando chamamos multer(), ele retorna um objeto que contém métodos (single, array, fields).

3️⃣ `single: jest.fn(() => (req, res, next) => next())`
A função single() recebe o nome de um campo de arquivo (upload.single('file')) e retorna um middleware Express.

- No código original, o multer processaria o arquivo antes de chamar next().

- No mock, apenas chamamos next() diretamente, simulando um upload sem processar nada.

4️⃣ array() e fields()
Eles seguem a mesma lógica de single(), mas para múltiplos arquivos.

Por fim para verificar se o multer foi chamado, no teste podemos incluir um

```js
expect(multer().single).toHaveBeenCalled();
```

Isso confirma que o multer foi instanciado e utilizado no código.

Para o caso Cloudinary podemos fazer:

```js
jest.mock("multer-storage-cloudinary", () => ({
  CloudinaryStorage: jest.fn(() => ({
    _handleFile: jest.fn((req, file, cb) => cb(null, { path: "mock-url" })),
    _removeFile: jest.fn((req, file, cb) => cb(null)),
  })),
}));
```

## Testes para rota de atualização de dados

Algumas rotas da nossa aplicação são utilizadas para atualizar os dados dos usuários, abaixo mostro como testar essas rotas.

```js
test("Deve atualizar campos validos do usuário", async () => {
  await request(app)
    .post("/users/profile")
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .send({
      name: "Alex",
    })
    .expect(200);

  const user = await findById(userID);
  expect(user.name).toEqual("Alex");
});
```

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

    npm i jest --save-dev

agora dentro do package.json, dentro do objeto _script_ adicione

```json
script: {
    "start": "node src/index.js",
    "dev":"env-cmd ./config/dev.env nodemon src/index.js",
    "test":"jest"
}
```

No terminal vamos executar o jest

    npm run test

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

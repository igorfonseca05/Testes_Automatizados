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

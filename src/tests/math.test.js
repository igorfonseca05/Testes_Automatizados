// Os testes automatizados unitários são executados nesse arquivo.

const add = require('../files/math')

describe('Testing add function', () => {

    test('Deve somar dois números', () => {
        expect(add(1, 2)).toBe(3)
    })

    test('Deve retornar numero negativo', () => {
        expect(add(-1, -5)).toBe(-6)
    })

    test('Deve retornar zero', () => {
        expect(add(4, 0)).toBe(4)
    })
})
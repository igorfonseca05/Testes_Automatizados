const palindromo = require('../files/palindromo')

describe('Testando palindromo', () => {

    test('Deve ser palindromo', () => {
        expect(palindromo('luz azul')).toBe(true)
    })

    test('Não deve ser palindromo', () => {
        expect(palindromo('caveira amarela')).toBe(false)
    })

})
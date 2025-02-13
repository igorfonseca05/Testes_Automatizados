

function isPalindromo(text) {
    text = text.replaceAll(' ', '')
    const arrayText = text.split('').reverse().join('').replaceAll(' ', '')

    if (arrayText === text) {
        return true
    }

    return false
}

isPalindromo('subi no onibus')


module.exports = isPalindromo
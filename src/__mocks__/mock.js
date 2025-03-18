
const { myName } = require('../files/mock')

const myMock = jest.fn()

myMock.mockReturnValue(myName('igor'))

console.log(myMock())
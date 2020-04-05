
const requireDirectory = require('require-directory')

require('dotenv').config({
  path: __dirname+'/../env/test.env'
})

console.log(process.env.PROVIDER_URL)


describe('ELAJS Store Tests', function(){

  before(async () => {

    console.log('Setting up smart contracts')

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    console.log('DONE setup')

  })

  requireDirectory(module, './', {exclude: /(index\.js)|(\.json)|(postman)/})
})

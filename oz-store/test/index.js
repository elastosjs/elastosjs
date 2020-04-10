
require('./config')

const requireDirectory = require('require-directory')

console.log(process.env.PROVIDER_URL)

describe('ELAJS Store Tests', function(){

  before(async () => {

    console.log('Setting up smart contracts')

    console.log('DONE setup')

  })

  requireDirectory(module, './', {exclude: /(index\.js)|(\.json)|(postman)/})
})

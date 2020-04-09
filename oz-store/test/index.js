
const requireDirectory = require('require-directory')

if (!process.env.NODE_ENV){
  console.error('missing NODE_ENV')
  process.exit(0)
}

let envPath

switch (process.env.NODE_ENV){
  case 'development':
    envPath = '/../env/test.env'
    break

  case 'elaethtest':
    envPath = '/../env/elaethtest.env'
    break
}

require('dotenv').config({
  path: __dirname + envPath
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



const secrets = require('../../secrets.json')

if (!process.env.NODE_ENV){
  console.error('missing NODE_ENV')
  process.exit(0)
}

let envPath, mnemonic, gasPrice, gasLimit, transactionDelay

switch (process.env.NODE_ENV){
  case 'development':
    envPath = '/../env/test.env'
    mnemonic = secrets.mnemonicDev
    gasPrice = '1000000000'
    gasLimit = 7000000
    transactionDelay = 1500
    break

  case 'elaethtest':
    envPath = '/../env/elaethtest.env'
    mnemonic = secrets.mnemonic2
    gasPrice = '1000000000'
    gasLimit = 7000000
    transactionDelay = 15000
    break
}

require('dotenv').config({
  path: __dirname + envPath
})

module.exports = {
  mnemonic,
  gasPrice,
  gasLimit,
  transactionDelay
}

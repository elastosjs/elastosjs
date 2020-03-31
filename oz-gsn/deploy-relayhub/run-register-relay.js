
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonic2
const provider = new HDWalletProvider(
  mnemonic, 'https://rpc.elaeth.io'
)

const web3 = new Web3(provider)

const { registerRelay } = require('./register-relay');

(async function(){

  await registerRelay(web3, {
    verbose: true,
    from: '0x243C7B804a1CB650c3f584FaC5e33FdB61Cd26CE'
  })

})()

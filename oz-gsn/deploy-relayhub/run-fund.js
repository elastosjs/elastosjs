
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonic2
const provider = new HDWalletProvider(
  mnemonic, 'https://rpc.elaeth.io'
)

const web3 = new Web3(provider)

const { fundRecipient } = require('./fund');

(async function(){

  const amt = await fundRecipient(web3, {
    verbose: true,
    from: '0x243C7B804a1CB650c3f584FaC5e33FdB61Cd26CE',
    relayHub: {
      address: '0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D'
    },
    recipient: '0xfD0fb7D22286D9522ab526B74ae6e0683926B9Df'
  })

  console.log(`Returned amt = ${amt}`)

})()

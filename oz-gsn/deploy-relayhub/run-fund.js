
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonic2
const provider = new HDWalletProvider(
  mnemonic, 'https://rpc.elaeth.io'
)

const web3 = new Web3(provider)

const recipientContract = process.argv[2]

const { fundRecipient } = require('./fund');

(async function(){

  const amt = await fundRecipient(web3, {
    verbose: true,
    from: '0x243C7B804a1CB650c3f584FaC5e33FdB61Cd26CE',
    relayHub: {

      // the truffle-migrate deployed address of the relay hub
      address: '0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D'
    },

    // deployed smart contract we want to call with GSN
    recipient: recipientContract
  })

  console.log(`Funded amt = ${web3.utils.fromWei(amt)} ETH`)

  process.exit(1)

})()

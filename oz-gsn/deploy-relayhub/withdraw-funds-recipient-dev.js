/**
 * This sends funds from
 * @type {HDWalletProvider}
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const recipientContractData = require('./recipient-data-dev');

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonicDev
const provider = new HDWalletProvider(
  mnemonic, 'http://localhost:8545'
)

const web3 = new Web3(provider)

// const relayHubAddress = '0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D'

const recipientAddress = process.argv[2]
// const amount = process.argv[3].toString()

;(async function(){

  const recipientContract = new web3.eth.Contract(recipientContractData.abi, recipientContractData.address, {
    data: recipientContractData.bytecode
  })

  try {
    let result = await recipientContract.methods.withdrawAll().send({
      // from: '0x2415eb2322C805528c6dDb88d6fa3F39e3CD6198',
      // from: '0x243C7B804a1CB650c3f584FaC5e33FdB61Cd26CE',
      from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', // dev
      gasPrice: 1e9
    })
    console.log(result)
  } catch (err){
    console.error(err)
  }

  process.exit(1)
})()

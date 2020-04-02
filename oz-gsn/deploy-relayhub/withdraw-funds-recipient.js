/**
 * This sends funds from
 * @type {HDWalletProvider}
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const recipientContractData = require('./recipient-data');

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonic2
const provider = new HDWalletProvider(
  mnemonic, 'https://rpc.elaeth.io'
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
    // let result = await recipientContract.methods.withdraw(web3.utils.toWei('0.01', 'ether'), recipientAddress).send({
    let result = await recipientContract.methods.withdrawAll(recipientAddress).send({
      from: '0x243C7B804a1CB650c3f584FaC5e33FdB61Cd26CE',
      gasPrice: 1e9,
      gas: 8000000
    })
    console.log(result)
  } catch (err){
    console.error(err)
  }

  process.exit(1)
})()

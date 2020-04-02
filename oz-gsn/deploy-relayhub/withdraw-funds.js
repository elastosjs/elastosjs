/**
 * This sends funds from
 * @type {HDWalletProvider}
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonic2
const provider = new HDWalletProvider(
  mnemonic, 'https://rpc.elaeth.io'
)

const web3 = new Web3(provider)

const relayHubAddress = '0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D'

const recipientAddress = process.argv[2]
const amount = process.argv[3].toString()

const { ether, getRelayHub } = require('./helpers');

(async function(){

  const relayHub = getRelayHub(web3, relayHubAddress)

  try {
    let result = await relayHub.methods.withdraw(ether(amount), recipientAddress).send({
      // from: '0x2415eb2322C805528c6dDb88d6fa3F39e3CD6198',
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

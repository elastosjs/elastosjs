
// this returns 0 for the relay address, those funds are on the actual balance

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')

const secrets = require('../../secrets.json')

const mnemonic = secrets.mnemonic2
const provider = new HDWalletProvider(
  mnemonic, 'https://rpc.elaeth.io'
)

const web3 = new Web3(provider)

const relayHubAddress = '0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D'

const recipientContract = process.argv[2]

const { getRelayHub } = require('./helpers');

(async function(){

  const relayHub = getRelayHub(web3, relayHubAddress)

  const currentBalance = new web3.utils.BN(await relayHub.methods.balanceOf(recipientContract).call())

  console.log(`${web3.utils.fromWei(currentBalance)} ETH`)

  process.exit(1)
})()

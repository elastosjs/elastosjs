
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

const TestBytesAryJSON = require('../build/contracts/TestBytesAry.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { fromConnection, ephemeral } = require("@openzeppelin/network")

const Web3 = require('web3')

const config = require('./config')

const namehash = require('../scripts/namehash')

const { strToBytes32, uintToBytes32 } = require('elajs')

describe.skip('Tests for ELA Testnet', () => {

  let ownerInstance, web3, ozWeb3, ephemeralInstance

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000,
      fixedGasPrice: '1000000000',
      fixedGasLimit: 250000
    })

    web3 = new Web3(new HDWalletProvider(
      config.mnemonic, process.env.PROVIDER_URL
    ))

    ownerInstance = new web3.eth.Contract(TestBytesAryJSON.abi, process.env.TEST_BYTES_ARY_CONTRACT_ADDR)

    ephemeralInstance = new ozWeb3.lib.eth.Contract(TestBytesAryJSON.abi, process.env.TEST_BYTES_ARY_CONTRACT_ADDR)
  })

  it.skip('Should Insert Multiple Values - Non-GSN', async () =>{

    const keysRaw = ['firstName', 'lastName']
    const valuesRaw = ['Clarence', 'Liu']

    assert(keysRaw.length === valuesRaw.length)

    const keys = [], values = []

    for (let i = 0, len = keysRaw.length; i < len; i++){
      keys.push(namehash.hash(keysRaw[i]))
      values.push(strToBytes32(valuesRaw[i]))
    }

    await ownerInstance.methods.addValues(keys, values).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: config.gasPrice
    })

    const firstName = await ownerInstance.methods.store(keys[0]).call()

    expect(Web3.utils.hexToString(firstName)).to.be.equal('Clarence')
  })

  it('Should Insert Multiple Values - GSN', async () =>{

    const keysRaw = ['firstName', 'lastName']
    const valuesRaw = ['Clarence', 'Liu']

    assert(keysRaw.length === valuesRaw.length)

    const keys = [], values = []

    for (let i = 0, len = keysRaw.length; i < len; i++){
      keys.push(namehash.hash(keysRaw[i]))
      values.push(strToBytes32(valuesRaw[i]))
    }

    await ephemeralInstance.methods.addValues(keys, values).send({
      from: ozWeb3.accounts[0]
    })

    const firstName = await ephemeralInstance.methods.store(keys[0]).call()

    expect(Web3.utils.hexToString(firstName)).to.be.equal('Clarence')
  })

})

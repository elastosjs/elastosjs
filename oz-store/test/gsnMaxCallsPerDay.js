
const chai = require('chai')
const expect = chai.expect

const secrets = require('../../secrets.json')
const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

const mnemonic = secrets.mnemonicDev
// const mnemonic = secrets.mnemonic2

describe('Tests GsnMaxCallsPerDay', () => {

  let ownerInstance

  before(async () => {

    web3 = new Web3(new HDWalletProvider(
      mnemonic, process.env.PROVIDER_URL
    ))

    ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

  })

  it('Should set the GSNMaxCallsPerDay', async () => {

    const instance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    const initialMax = await instance.methods.gsnMaxCallsPerDay().call()

    expect(parseInt(initialMax)).to.be.equal(1000)

    await instance.methods.setGsnMaxCallsPerDay(500).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '1000000000'
    })

    const newMax = await instance.methods.gsnMaxCallsPerDay().call()

    expect(parseInt(newMax)).to.be.equal(500)

  })

})

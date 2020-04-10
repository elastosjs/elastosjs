
const chai = require('chai')
const expect = chai.expect

const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

const config = require('./config')

// TODO: test limit, increment
describe.skip('Tests GsnMaxCallsPerDay', () => {

  let ownerInstance

  before(async () => {

    web3 = new Web3(new HDWalletProvider(
      config.mnemonic, process.env.PROVIDER_URL
    ))

    ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

  })

  it('Should set the GSNMaxCallsPerDay', async () => {

    const initialMax = await ownerInstance.methods.gsnMaxCallsPerDay().call()

    expect(parseInt(initialMax)).to.be.equal(1000)

    await ownerInstance.methods.setGsnMaxCallsPerDay(500).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '1000000000'
    })

    const newMax = await ownerInstance.methods.gsnMaxCallsPerDay().call()

    expect(parseInt(newMax)).to.be.equal(500)

  })

})

/*
describe('Tests (GSN Sanity Check) for Version', () => {

  let ozWeb3

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000
    })

  })

  it('Should increase version to 5', async () => {

    const instance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    const initialVersion = await instance.methods.version(Web3.utils.hexToBytes('0x9cc3502caa8a7a65b67456ee1f514ee37f6d8360a26702e00a047b2bd0a8fb45')).call()

    console.log('initialVersion', initialVersion)

    expect(initialVersion).to.be.equal('0')

    await instance.methods.setVersion(Web3.utils.hexToBytes('0x9cc3502caa8a7a65b67456ee1f514ee37f6d8360a26702e00a047b2bd0a8fb45'), 5).send({
      from: ozWeb3.accounts[0],
      gasPrice: '1050000000'
    })

    const newVersion = await instance.methods.version(Web3.utils.hexToBytes('0x9cc3502caa8a7a65b67456ee1f514ee37f6d8360a26702e00a047b2bd0a8fb45')).call()

    console.log('newVersion', newVersion)

    expect(parseInt(newVersion)).to.be.equal(5)

  })

})
*/

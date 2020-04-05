
const chai = require('chai')
const expect = chai.expect

const secrets = require('../../secrets.json')
const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const Web3 = require('web3')
const _ = require('lodash')

const mnemonicDev = secrets.mnemonicDev

describe('Tests for Create Table', () => {

  let ozWeb3, web3

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000
    })

    web3 = new Web3(new HDWalletProvider(
      mnemonicDev, process.env.PROVIDER_URL
    ))

  })

  it('Should fail to create a table, because only owner can', async () => {

    const instance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    try {
      await instance.methods.createTable(process.env.TEST_NAMEHASHED, 1).send({
        from: ozWeb3.accounts[0],
        gasPrice: '10000000000'
      })

      assert.fail('Should not allow createTable')
    } catch (err){
      expect(err.message).to.be.equal('Error: Error estimating gas usage for transaction (Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner). Make sure the transaction is valid, or set a fixed gas value.')
    }

  })

  it('Should create the table', async () => {

    const instance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    await instance.methods.createTable(process.env.TEST_NAMEHASHED, 1).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '10000000000'
    })

  })
})

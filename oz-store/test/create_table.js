
const chai = require('chai')
const expect = chai.expect

const secrets = require('../../secrets.json')
const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const Web3 = require('web3')

const devPrivKey = secrets.devPrivKey

describe('Tests for Create Table', () => {

  /*
  let ozWeb3, web3

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000
    })

    web3 = new Web3(new PrivateKeyProvider(
      devPrivKey, process.env.PROVIDER_URL
    ))

  })

  it('Should fail to create a table, because only owner can', async () => {

    const instance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    await instance.methods.increaseVersion().send({ from: ozWeb3.accounts[0], gasPrice: '10000000000' })

  })
   */

})

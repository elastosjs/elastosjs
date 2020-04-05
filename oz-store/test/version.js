
const chai = require('chai')
const expect = chai.expect

const secrets = require('../../secrets.json')
const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const Web3 = require('web3')

const devPrivKey = secrets.devPrivKey

describe('Tests (GSN Sanity Check) for Version', () => {

  let ozWeb3

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000
    })

  })

  it('Should increase version by 1', async () => {

    const instance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    let version = await instance.methods.version().call()

    expect(parseInt(version)).to.be.equal(0)

    await instance.methods.increaseVersion().send({ from: ozWeb3.accounts[0], gasPrice: '10000000000' })

    version = await instance.methods.version().call()

    expect(parseInt(version)).to.be.equal(1)

  })

})

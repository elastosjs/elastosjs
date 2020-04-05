
const chai = require('chai')
const expect = chai.expect

const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

const { fromConnection, ephemeral } = require("@openzeppelin/network")

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

    const initialVersion = await instance.methods.version().call()

    await instance.methods.increaseVersion().send({ from: ozWeb3.accounts[0], gasPrice: '10000000000' })

    const newVersion = await instance.methods.version().call()

    expect(parseInt(newVersion)).to.be.equal(parseInt(initialVersion) + 1)

  })

})

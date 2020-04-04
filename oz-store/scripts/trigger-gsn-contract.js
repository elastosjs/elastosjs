/**
 * Use this to simulate an ephemeral call
 */
const { fromConnection, ephemeral } = require("@openzeppelin/network")

const PROVIDER_URL = "http://127.0.0.1:8545"

const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

;(async () => {
  const ozWeb3 = await fromConnection(PROVIDER_URL, {
    gsn: { signKey: ephemeral() },
    pollInterval: 5000
  })

  const instance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, ELAJSStoreJSON.networks['1585998008507'].address)

  console.log(`Calling from ${ozWeb3.accounts[0]}`)

  await instance.methods.increaseVersion().send({ from: ozWeb3.accounts[0], gasPrice: '10000000000' })

  process.exit(1)
})()

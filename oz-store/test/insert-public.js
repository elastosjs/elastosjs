
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

const { Keccak } = require('sha3')
const sha3 = new Keccak(256)

const secrets = require('../../secrets.json')
const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const Web3 = require('web3')
const _ = require('lodash')
const namehash = require('../scripts/namehash')

const mnemonicDev = secrets.mnemonicDev

const { strToBytes32, uintToBytes32 } = require('elajs')

describe('Tests for Insert Public Table', () => {

  let ozWeb3, web3, ephemeralInstance, ownerInstance

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000
    })

    web3 = new Web3(new HDWalletProvider(
      mnemonicDev, process.env.PROVIDER_URL
    ))

    ephemeralInstance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

  })

  it('Should insert multiple fields/cols for a row', async () => {

    const values = [strToBytes32('Clarence'), strToBytes32('Liu'), uintToBytes32(33)]
    const fields = ['firstName', 'lastName', 'age']
    const fieldKeys = []
    const fieldIdTableKeys = []

    sha3.reset()

    const id = Web3.utils.randomHex(32)
    const idStr = id.substring(2)
    const idKey = sha3.update(idStr).digest()

    sha3.reset()

    const tableKey = namehash.hash('user')
    const idTableKey = namehash.hash(`${idStr}.user`)

    for (let i = 0; i < fields.length; i++){
      sha3.reset()
      fieldKeys.push(sha3.update(fields[i]).digest())
      fieldIdTableKeys.push(namehash.hash(`${fields[i]}.${idStr}.user`))
    }

    try {
      await ownerInstance.methods.insertTestVal(tableKey, idTableKey, fieldIdTableKeys[0], idKey, fieldKeys[0], id, values[2]).send({
        from: web3.eth.personal.currentProvider.addresses[0],
        gasPrice: '10000000000'
      })
    } catch (err){
      expect(err.message).to.be.equals('VM Exception while processing transaction: revert table does not exist')
    }

    // now create the table, this will be a public table - still need the ownerInstance to create it
    await ownerInstance.methods.createTable(tableKey, 2).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '10000000000'
    })

    await ephemeralInstance.methods.insert(tableKey, idTableKey, idKey, id, fieldKeys, fieldIdTableKeys, values).send({
      from: ozWeb3.accounts[0],
      gasPrice: '10000000000'
    })

  })

  it('Should insert multiple fields/cols for a row - 2', async () => {
    // don't need to implement this for now

    const values = [strToBytes32('Mary'), strToBytes32('Jane'), uintToBytes32(25)]
    const fields = ['firstName', 'lastName', 'age']
    const fieldKeys = []
    const fieldIdTableKeys = []

    sha3.reset()

    const id = Web3.utils.randomHex(32)
    const idStr = id.substring(2)
    const idKey = sha3.update(idStr).digest()

    sha3.reset()

    const tableKey = namehash.hash('user')
    const idTableKey = namehash.hash(`${idStr}.user`)

    for (let i = 0; i < fields.length; i++){
      sha3.reset()
      fieldKeys.push(sha3.update(fields[i]).digest())
      fieldIdTableKeys.push(namehash.hash(`${fields[i]}.${idStr}.user`))
    }

    await ephemeralInstance.methods.insert(tableKey, idTableKey, idKey, id, fieldKeys, fieldIdTableKeys, values).send({
      from: ozWeb3.accounts[0],
      gasPrice: '10000000000'
    })

    const ids = await ephemeralInstance.methods.getTableIds(tableKey).call()

    const results = []

    for (i = 0; i < ids.length; i++){

      results.push([])

      for (let j = 0; j < 3; j++){
        let fieldIdTableKey = namehash.hash(`${fields[j]}.${ids[i].substring(2)}.user`)

        let val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

        results[i].push(j < 2 ? Web3.utils.hexToString(val) : Web3.utils.hexToNumber(val))
      }
    }

    console.log(results)
  })

})

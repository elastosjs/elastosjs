
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

const mnemonic = secrets.mnemonicDev
// const mnemonic = secrets.mnemonic2

const { strToBytes32, uintToBytes32 } = require('elajs')

describe('Tests for Insert Public Table', () => {

  let ozWeb3, web3, ephemeralInstance, ownerInstance

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000
    })

    web3 = new Web3(new HDWalletProvider(
      mnemonic, process.env.PROVIDER_URL
    ))

    ephemeralInstance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

  })

  it('Should insert a test value (str)', async () => {

    const VAL_RAW = 'Clarence'
    const VAL = strToBytes32(VAL_RAW)

    sha3.reset()
    const id = Web3.utils.randomHex(32)
    const idStr = id.substring(2)
    const idKey = sha3.update(idStr).digest()

    sha3.reset()

    const tableKey = namehash.hash('user')
    const idTableKey = namehash.hash(`${idStr}.user`)

    const fieldStr = 'firstName'
    const fieldIdTableKey = namehash.hash(`${fieldStr}.${idStr}.user`)

    sha3.reset()

    const fieldKey = sha3.update(fieldStr).digest()

    try {
      await ownerInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
        from: web3.eth.personal.currentProvider.addresses[0],
        gasPrice: '1020000000'
      })
      assert.fail()
    } catch (err){
      // expect(err.message).to.be.equals('VM Exception while processing transaction: revert table does not exist')
      assert.exists(err)
    }

    // now create the table, this will be a public table - still need the ownerInstance to create it
    await ownerInstance.methods.createTable(tableKey, 2).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '1020000000'
    })


    await ephemeralInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
      from: ozWeb3.accounts[0],
      gasPrice: '1020000000'
    })

    // check for value
    const val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    expect(Web3.utils.hexToString(val)).to.be.equal(VAL_RAW)
  })

  it.skip('Should insert multiple fields/cols for a row', async () => {

    // const values = [strToBytes32('Clarence'), strToBytes32('Liu'), uintToBytes32(33), Buffer.from('4db5e4ba80417f817626fc96c52c6b5edbe5f305306d0490f2f2ea5e7dbb97f7', 'hex')]
    const values = [strToBytes32('Clarence'), strToBytes32('Liu'), uintToBytes32(33)]
    // const fields = ['firstName', 'lastName', 'age', 'email']
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
        gasPrice: '1050000000'
      })
      assert.fail()
    } catch (err){
      // expect(err.message).to.be.equals('VM Exception while processing transaction: revert table does not exist')
      assert.exists(err)
    }

    // now create the table, this will be a public table - still need the ownerInstance to create it
    await ownerInstance.methods.createTable(tableKey, 2).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '1050000000'
    })

    // sleep 10s
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 10000)
    })

    console.log(tableKey, idTableKey, idKey, id, fieldKeys, fieldIdTableKeys, values)

    await ephemeralInstance.methods.insert(tableKey, idTableKey, idKey, id, fieldKeys, fieldIdTableKeys, values).send({
      from: ozWeb3.accounts[0],
      gas: '8000000',
      gasPrice: '1050000000'
    })



    try {
      await ephemeralInstance.methods.insert(tableKey, idTableKey, idKey, id, fieldKeys, fieldIdTableKeys, values).send({
        from: ozWeb3.accounts[0],
        gas: '8000000',
        gasPrice: '1050000000'
      })
      assert.fail('Should not be able to re-insert same id')

    } catch (err){
      // expect(err.message).to.be.equal('Error: Error estimating gas usage for transaction (Returned error: VM Exception while processing transaction: revert id already exists). Make sure the transaction is valid, or set a fixed gas value.')
      assert.exists(err)
    }

  })

  it.skip('Should insert multiple fields/cols for a row - 2', async () => {
    // don't need to implement this for now

    // const values = [strToBytes32('Mary'), strToBytes32('Jane'), uintToBytes32(25), Buffer.from('9cadf48a23e6f477150251983b0c9f3c9c9b57d17f770d3b6b99b5b19ca10c32', 'hex')]
    // const fields = ['firstName', 'lastName', 'age', 'email']
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
      gasPrice: '1050000000'
    })

    const ids = await ephemeralInstance.methods.getTableIds(tableKey).call()

    const results = []

    for (i = 0; i < ids.length; i++){

      results.push([])

      for (let j = 0; j < values.length; j++){
        let fieldIdTableKey = namehash.hash(`${fields[j]}.${ids[i].substring(2)}.user`)

        let val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

        if (j < 2){
          results[i].push(Web3.utils.hexToString(val))
        } else if (j === 2){
          results[i].push(Web3.utils.hexToNumber(val))
        } else if (j === 3){
          results[i].push(val)
        }
      }
    }

    console.log(results);

    expect(results.length).to.be.equal(2)

    results.forEach((row) => {

      expect(row.length).to.be.equal(4)

      let [firstName, lastName, age] = row

      if (firstName === 'Clarence'){
        expect(lastName).to.be.equal('Liu')
        expect(age).to.be.equal(33)
      } else if (firstName === 'Mary'){
        expect(lastName).to.be.equal('Jane')
        expect(age).to.be.equal(25)
      } else {
        assert.fail('Unexpected Row')
      }
    })
  })

})

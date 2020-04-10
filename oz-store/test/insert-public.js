
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

const { Keccak } = require('sha3')
const sha3 = new Keccak(256)

const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const Web3 = require('web3')
const _ = require('lodash')
const namehash = require('../scripts/namehash')

const config = require('./config')

const { strToBytes32, uintToBytes32 } = require('elajs')

describe('Tests for Insert Public Table', () => {

  let ozWeb3, ozWeb3Other, web3, ephemeralInstance, ephemeralInstanceOther, ownerInstance

  let id, id2, idStr, idKey, id2Key, tableKey, idTableKey, id2TableKey

  const fieldIdTableKeys = []
  const fieldKeys = []

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000,
      fixedGasPrice: config.gasPrice
    })

    ozWeb3Other = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000,
      fixedGasPrice: config.gasPrice
    })

    web3 = new Web3(new HDWalletProvider(
      config.mnemonic, process.env.PROVIDER_URL
    ))

    ephemeralInstance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)
    ephemeralInstanceOther = new ozWeb3Other.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    sha3.reset()
    id = Web3.utils.randomHex(32)
    idStr = id.substring(2)
    idKey = sha3.update(idStr).digest()

    sha3.reset()

    tableKey = namehash.hash('user')
    idTableKey = namehash.hash(`${idStr}.user`)

  })

  it.skip('Should INSERT a test value (str) with 1 field to an ID', async () => {

    const VAL_RAW = 'Clarence'
    const VAL = strToBytes32(VAL_RAW)

    const fieldStr = 'firstName'
    const fieldIdTableKey = namehash.hash(`${fieldStr}.${idStr}.user`)

    fieldIdTableKeys.push(fieldIdTableKey)

    sha3.reset()

    const fieldKey = sha3.update(fieldStr).digest()

    try {
      await ownerInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
        from: web3.eth.personal.currentProvider.addresses[0],
        gasPrice: config.gasPrice
      })
      assert.fail()
    } catch (err){
      // expect(err.message).to.be.equals('VM Exception while processing transaction: revert table does not exist')
      assert.exists(err)
    }

    // now create the table, this will be a public table - still need the ownerInstance to create it
    await ownerInstance.methods.createTable(tableKey, 2).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: config.gasPrice
    })

    // estimate gas - doesn't work?
    /*
    const gasEstInsert1 = await ephemeralInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).estimateGas({
      gas: 10000000000,
      from: ozWeb3.accounts[0]
    })

    console.log(gasEstInsert1)
    */

    await ephemeralInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
      from: ozWeb3.accounts[0]
    })

    // check for value
    const val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    expect(Web3.utils.hexToString(val)).to.be.equal(VAL_RAW)

    // try to insert into the same slot, should fail because ID exists
    try {
      await ephemeralInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
        from: ozWeb3.accounts[0]
      })
    } catch (err){
      assert.exists(err)
    }
  })

  it.skip('Should INSERT a test value (int, str) with multiple fields to an ID', async () => {

    const VAL_RAW = 5121
    const VAL = uintToBytes32(VAL_RAW)

    const VAL2_RAW = 'John'
    const VAL2 = strToBytes32(VAL2_RAW)

    sha3.reset()

    const id = Web3.utils.randomHex(32)
    id2 = id
    const idStr = id.substring(2)
    const idKey = sha3.update(idStr).digest()
    id2Key = idKey

    const fieldStr = 'last4ssn'
    const fieldIdTableKey = namehash.hash(`${fieldStr}.${idStr}.user`)

    fieldIdTableKeys.push(fieldIdTableKey)

    const fieldStr2 = 'firstName'
    const fieldIdTableKey2 = namehash.hash(`${fieldStr2}.${idStr}.user`)

    fieldIdTableKeys.push(fieldIdTableKey2)

    const idTableKey = namehash.hash(`${idStr}.user`)
    id2TableKey = idTableKey

    sha3.reset()

    const fieldKey = sha3.update(fieldStr).digest()
    fieldKeys.push(fieldKey)

    sha3.reset()

    const fieldKey2 = sha3.update(fieldStr2).digest()
    fieldKeys.push(fieldKey2)


    await ephemeralInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
      from: ozWeb3.accounts[0]
    })

    // check for value
    const val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    expect(Web3.utils.hexToNumber(val)).to.be.equal(VAL_RAW)

    await ephemeralInstance.methods.insertVal(tableKey, idTableKey, fieldIdTableKey2, idKey, fieldKey2, id, VAL2).send({
      from: ozWeb3.accounts[0]
    })

    // check for value
    const val2 = await ephemeralInstance.methods.getRowValue(fieldIdTableKey2).call()

    expect(Web3.utils.hexToString(val2)).to.be.equal(VAL2_RAW)

  })

  it.skip('Should UPDATE a test value (str)', async () => {

    const VAL_RAW = 'Mary'
    const VAL = strToBytes32(VAL_RAW)

    const fieldStr = 'firstName'
    const fieldIdTableKey = namehash.hash(`${fieldStr}.${idStr}.user`)

    sha3.reset()

    const fieldKey = sha3.update(fieldStr).digest()

    try {
      await ephemeralInstanceOther.methods.updateVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
        from: ozWeb3Other.accounts[0]
      })
    } catch (err){
      // TODO: better error differentiation
      assert.exists(err)
    }

    await ephemeralInstance.methods.updateVal(tableKey, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
      from: ozWeb3.accounts[0]
    })

    // check for value
    const val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    expect(Web3.utils.hexToString(val)).to.be.equal(VAL_RAW)

  })

  it('Should DELETE a the global test id value', async () => {

    const fieldStr = 'firstName'
    const fieldIdTableKey = namehash.hash(`${fieldStr}.${idStr}.user`)

    // check for id in table
    // let tableIds = await ephemeralInstance.methods.getTableIds(tableKey).call()

    // expect(tableIds.length).to.be.equal(0)

    // sha3.reset()

    const fieldKey = Web3.utils.bytesToHex(sha3.update(fieldStr).digest())

    // check for value
    // let val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    // this was the updated value
    // expect(Web3.utils.hexToString(val)).to.be.equal('Mary')

    console.log(tableKey, idTableKey, idKey, fieldKey, id, [fieldKey], [fieldIdTableKey])

    // await ephemeralInstance.methods.deleteVal(tableKey, idTableKey, idKey, fieldKey, id, [fieldKey], [fieldIdTableKey]).send({
    await ephemeralInstance.methods.deleteVal(tableKey, idTableKey, idKey, id, [fieldKey], [fieldIdTableKey]).send({
      from: ozWeb3.accounts[0]
    })

    console.log('delete done')

    /*
    tableIds = await ephemeralInstance.methods.getTableIds(tableKey).call()

    expect(tableIds.length).to.be.equal(1)


    // check for value
    val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    expect(Web3.utils.hexToNumber(val)).to.be.equal(0)

    // remove the id from the array
    fieldIdTableKeys.shift()

    for (let i = 0; i < fieldIdTableKeys.length; i++){
      let val = await ephemeralInstance.methods.getRowValue(fieldIdTableKeys[i]).call()

      expect(Web3.utils.hexToNumber(val)).to.not.be.equal(0)
    }


    // await ephemeralInstance.methods.deleteVal(tableKey, id2TableKey, id2Key, fieldKey, id2, fieldKeys, fieldIdTableKeys).send({
    await ephemeralInstance.methods.deleteVal(tableKey, id, fieldKeys, fieldIdTableKeys).send({
      from: ozWeb3.accounts[0]
    })

    for (let i = 0; i < fieldIdTableKeys.length; i++){
      let val = await ephemeralInstance.methods.getRowValue(fieldIdTableKeys[i]).call()

      expect(Web3.utils.hexToNumber(val)).to.be.equal(0)
    }

    tableIds = await ephemeralInstance.methods.getTableIds(tableKey).call()

    expect(tableIds.length).to.be.equal(0)
     */
  })

  // doesn't work on testnet
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
        gasPrice: config.gasPrice
      })
      assert.fail()
    } catch (err){
      // expect(err.message).to.be.equals('VM Exception while processing transaction: revert table does not exist')
      assert.exists(err)
    }

    // now create the table, this will be a public table - still need the ownerInstance to create it
    await ownerInstance.methods.createTable(tableKey, 2).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: config.gasPrice
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
      gasPrice: config.gasPrice
    })



    try {
      await ephemeralInstance.methods.insert(tableKey, idTableKey, idKey, id, fieldKeys, fieldIdTableKeys, values).send({
        from: ozWeb3.accounts[0],
        gasPrice: config.gasPrice
      })
      assert.fail('Should not be able to re-insert same id')

    } catch (err){
      // expect(err.message).to.be.equal('Error: Error estimating gas usage for transaction (Returned error: VM Exception while processing transaction: revert id already exists). Make sure the transaction is valid, or set a fixed gas value.')
      assert.exists(err)
    }

  })

  // doesn't work on testnet
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
      gasPrice: config.gasPrice
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

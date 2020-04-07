
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

describe('Tests for Insert Private Table', () => {

  let ozWeb3, web3, ephemeralInstance, ownerInstance

  const TEST_NAMEHASH = namehash.hash('test')
  console.log(`test -> ${TEST_NAMEHASH}`)


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

    /*
    ownerInstance.once('OwnerChecked', {fromBlock: 0}, (err, ev) => {
      console.log('OwnerChecked', ev)
    })
    */
  })

  it('Should fail to create a table, because only owner can', async () => {

    try {
      await ephemeralInstance.methods.createTable(TEST_NAMEHASH, 1).send({
        from: ozWeb3.accounts[0],
        gasPrice: '10000000000'
      })

      assert.fail('Should not allow createTable')
    } catch (err){
      expect(err.message).to.be.equal('Error: Error estimating gas usage for transaction (Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner). Make sure the transaction is valid, or set a fixed gas value.')
    }

  })

  it('Should create the table', async () => {

    // This is a private table!
    await ownerInstance.methods.createTable(TEST_NAMEHASH, 1).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '10000000000'
    })

    // check if it was created
    const tableMetadata = await ephemeralInstance.methods.getTableMetadata(TEST_NAMEHASH).call()

    expect(tableMetadata.permission).to.be.equal('1')

    try {
      await ephemeralInstance.methods.getTableMetadata(namehash('blah')).call()
    } catch (err){
      assert.exists(err, 'get non-existing table did not return error')
    }

  })

  it('Should check if the table exists', async () => {

    const checkFakeTable = await ephemeralInstance.methods.tableExists(Web3.utils.randomHex(32)).call()

    expect(checkFakeTable).to.be.false

    const checkTestTable = await ephemeralInstance.methods.tableExists(TEST_NAMEHASH).call()

    expect(checkTestTable).to.be.true

  })

  it('Should fail because only owner can insert on this table', async () => {

    const id = Web3.utils.randomHex(32)
    const idStr = id.substring(2)

    try {
      await ephemeralInstance.methods.insertTest(TEST_NAMEHASH, id, namehash.hash(`${idStr}.test`), 7).send({
        from: ozWeb3.accounts[0],
        gasPrice: '10000000000'
      })
    } catch (err){
      assert.exists(err)
    }

  })

  it('Should insert a test value', async () => {

    const VAL = 9;

    sha3.reset()
    const id = Web3.utils.randomHex(32)
    const idStr = id.substring(2)
    // console.log(`id = ${idStr}`)
    const idKey = sha3.update(idStr).digest()
    // console.log(`idKey = ${idKey.toString('hex')}`)

    sha3.reset()

    // Becareful here, namehash.hash returns with a 0x prefix, that shouldn't go into Buffer.from
    // const namehashConcat = sha3.update(Buffer.concat([Buffer.from(namehash.hash('test').substring(2), 'hex'), idKey])).digest()
    // const namehashConcat = sha3.update(Buffer.concat([Buffer.from(TEST_NAMEHASH.substring(2), 'hex'), idKey])).digest()
    const namehashConcat = sha3.update(Buffer.concat([Buffer.from(TEST_NAMEHASH.substring(2), 'hex'), idKey])).digest()
    const idTableKey = namehash.hash(`${idStr}.test`)

    // console.log(`table = ${TEST_NAMEHASH}`)

    expect(Web3.utils.bytesToHex(namehashConcat)).to.be.equal(idTableKey)

    // console.log(`idTableKey = ${idTableKey}`)

    const fieldStr = 'my_field'
    const fieldIdTableKey = namehash.hash(`${fieldStr}.${idStr}.test`)

    sha3.reset()

    const fieldKey = sha3.update(fieldStr).digest()

    // console.log(`dataKey = ${fieldIdTableKey}`)

    try {
      await ephemeralInstance.methods.insertTestVal(TEST_NAMEHASH, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
        from: ozWeb3.accounts[0],
        gasPrice: '10000000000'
      })
    } catch (err){
      assert.exists(err)
    }

    await ownerInstance.methods.insertTestVal(TEST_NAMEHASH, idTableKey, fieldIdTableKey, idKey, fieldKey, id, VAL).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: '10000000000'
    })

    // check for value
    const val = await ephemeralInstance.methods.getRowValue(fieldIdTableKey).call()

    expect(Web3.utils.hexToNumber(val)).to.be.equal(VAL)
  })

})

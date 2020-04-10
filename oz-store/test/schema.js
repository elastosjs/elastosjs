
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

const { Keccak } = require('sha3')
const sha3 = new Keccak(256)

const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const { fromConnection, ephemeral } = require("@openzeppelin/network")
const Web3 = require('web3')
const namehash = require('../scripts/namehash')

const config = require('./config')

const { strToBytes32, uintToBytes32, bytes32ToStr } = require('elajs')

describe('Tests for Table Schema', () => {

  const TABLE_NAME = 'inventory'
  const TABLE_NAME_BYTES32 = strToBytes32(TABLE_NAME)

  let ozWeb3, web3, ownerInstance, ephemeralInstance

  let tableKey

  before(async () => {

    ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
      gsn: { signKey: ephemeral() },
      pollInterval: 5000,
      fixedGasPrice: config.gasPrice,
      fixedGasLimit: config.gasLimit
    })

    web3 = new Web3(new HDWalletProvider(
      config.mnemonic, process.env.PROVIDER_URL
    ))

    ephemeralInstance = new ozWeb3.lib.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, process.env.ELAJSSTORE_CONTRACT_ADDR)

    tableKey = namehash.hash(TABLE_NAME)
  })

  // TODO: implement table add column, for now I guess we can overwrite the whole thing?
  it('Should create a table with a schema and return it', async () => {

    const colsRaw = ['item_code', 'item_name', 'color', 'description', 'qty', 'imgIPFS']
    const typesRaw = ['CHAR32', 'CHAR32', 'CHAR32', 'TEXT', 'UINT', 'BYTES32']

    const cols = colsRaw.map((colName) => strToBytes32(colName))
    const types = typesRaw.map((colName) => strToBytes32(colName))

    assert(cols.length === types.length)

    expect(bytes32ToStr(types[0])).to.be.equal('CHAR32')


    // now create the table, this will be a public table - still need the ownerInstance to create it
    await ownerInstance.methods.createTable(
      TABLE_NAME_BYTES32,
      tableKey,
      2,
      cols,
      types
    ).send({
      from: web3.eth.personal.currentProvider.addresses[0],
      gasPrice: config.gasPrice
    })

    const schema = await ownerInstance.methods.getTable(tableKey).call()


    expect(Web3.utils.hexToString(schema.name)).to.be.equals(TABLE_NAME)

    const colsResult = schema.columns.map((colData) => {
      return {
        name: Web3.utils.hexToString(colData.name),
        type: Web3.utils.hexToString(colData._dtype),
      }
    })

    // console.log(colsResult)

    expect(colsResult.length).to.be.equal(6)

    expect(colsResult[3].name).to.be.equal('description')
    expect(colsResult[3].type).to.be.equal('TEXT')

  })

})

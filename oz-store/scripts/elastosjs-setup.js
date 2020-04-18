
// shared with tests - we expect NODE_ENV to be set
// this pulls in secrets.json
const config = require('../test/config')

const Web3 = require('web3')
const { ELA_JS, keccak256, uintToBytes32 } = require('ela-js')

// TODO: make this an argv
const FM_ETH_ADDRESS = '0xfEB943725Ed070e8D5645736484Ba6494dcBA31a'

const contractAddr = process.env.ELAJSSTORE_CONTRACT_ADDR

console.log(`contractAddr = ${contractAddr}`)

const HDWalletProvider = require('@truffle/hdwallet-provider')
const { fromConnection, ephemeral } = require("@openzeppelin/network")

const web3 = new Web3(new HDWalletProvider(
  config.mnemonic, process.env.PROVIDER_URL
))


// const ELAJSStoreJSON = require('../build/contracts/ELAJSStore.json')

// createTable call
/*
npx oz send-tx --network development --to 0x592c129085b61A3110Ebd1DCD99F3Cfe97A54dF3 --method createTable
--args 0x7573657200000000000000000000000000000000000000000000000000000000,0x74524c27ce53e5e8e2119ff0e0a0c75b1fdac843280330c4196d97138462daff,3,[],[]
 */

;(async () => {

  const tableName = 'user'

  // const ownerInstance = new web3.eth.Contract(ELAJSStoreJSON.abi, contractAddr)

  /*
  const tableNameValue = Web3.utils.stringToHex(tableName)
  const tableKey = namehash(tableName)
  */


  const ozWeb3 = await fromConnection(process.env.PROVIDER_URL, {
    gsn: { signKey: ephemeral() },
    pollInterval: 5000,
    fixedGasPrice: config.gasPrice,
    fixedGasLimit: config.gasLimit
  })

  const elastosjs = new ELA_JS({
    defaultWeb3: web3,
    ephemeralWeb3: ozWeb3,
    contractAddress: contractAddr
  })

  /*
  CREATE TABLE
   */
  let cols = ['ethAddressHash', 'authHash', 'admin']
  let typesRaw = ['BYTES32', 'BYTES32', 'BOOL']
  let colsHashed = cols.map((colName) => Web3.utils.stringToHex(colName))
  let types = typesRaw.map((colName) => Web3.utils.stringToHex(colName))
  await elastosjs.createTable(tableName, 3, colsHashed, types)

  /*
  ADMIN USER
   */
  const id = keccak256('clarencel' + FM_ETH_ADDRESS)
  // const colTypes = ['BYTES32', 'BYTES32', 'BOOL']
  const values = [keccak256(FM_ETH_ADDRESS), keccak256(id.substring(2) + 'testtest1' + FM_ETH_ADDRESS.substring(2) + 'elajs'), uintToBytes32(1)]

  console.log(`id = ${id}`)

  await elastosjs.insertRow(tableName, cols, values, {id: id})
  // TODO: run checks

  // we need userId to differentiate between diff accts with the same fm address
  cols = ['dbName', 'contractAddress', 'userId']
  // contractAddress should be ADDRESS type
  typesRaw = ['STRING', 'ADDRESS', 'BYTES32']
  colsHashed = cols.map((colName) => Web3.utils.stringToHex(colName))
  types = typesRaw.map((colName) => Web3.utils.stringToHex(colName))
  await elastosjs.createTable('database', 2, colsHashed, types)

  process.exit(1)

})()

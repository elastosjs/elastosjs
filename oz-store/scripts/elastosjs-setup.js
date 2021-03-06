
// shared with tests - this checks if NODE_ENV is set
// this pulls in secrets.json
// TODO: BFG this maybe since we had FM_ETH_ADDRESS shown
// TODO: this must be BFGed if we open-source this'


const config = require('../test/config')

let contracts
if (process.env.NODE_ENV === 'local'){
  contracts = require('../../client/src/config/local')
} else if (process.env.NODE_ENV === 'testnet'){
  contracts = require('../../client/src/config/testnet')
}

console.log(contracts)

const Web3 = require('web3')
const { elajs, keccak256, uintToBytes32 } = require('ela-js')

// TODO: make this an argv
const FM_ETH_ADDRESS = config.fmEthAddr

console.log(process.env.PROVIDER_URL)

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

  const elajsDb = new elajs.database({
    defaultWeb3: web3,
    ephemeralWeb3: ozWeb3,

    databaseContractAddr: contracts.databaseContractAddr,
    relayHubAddr: contracts.relayHubAddr,

    debug: true
  })

  const id = keccak256('clarencel' + FM_ETH_ADDRESS)

  // CREATE TABLE
  const colsUser = ['ethAddressHash', 'authHash', 'admin']
  // console.log(await elajsDb.getVal(tableName, id, 'admin'))
  // console.log(await elajsDb.getTableSchema('database'))

  const typesUser = ['BYTES32', 'BYTES32', 'BOOL']
  await elajsDb.createTable(tableName, 3, colsUser, typesUser)

  // ADMIN USER

  const values = [keccak256(FM_ETH_ADDRESS), keccak256(id.substring(2) + 'testtest1' + FM_ETH_ADDRESS.substring(2) + 'elajs'), true]

  // console.log(`id = ${id}`)
  // console.log(colsUser)
  // console.log(values)

  await elajsDb.insertRow(tableName, colsUser, values, {id: id})

  // TODO: run checks


  // we need userId to differentiate between diff accts with the same fm address

  const colsDatabase = ['dbName', 'contractAddress', 'userId']
  // contractAddress should be ADDRESS type
  const typesDatabase = ['STRING', 'ADDRESS', 'BYTES32']
  await elajsDb.createTable('database', 2, colsDatabase, typesDatabase)


  process.exit(1)

})()

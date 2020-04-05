const { Keccak } = require('sha3')
const sha3 = new Keccak(256)
const web3 = require('Web3')

console.log(web3.utils.bytesToHex(sha3.update(process.argv[2]).digest()))


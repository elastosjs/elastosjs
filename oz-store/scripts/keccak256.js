const { Keccak } = require('sha3')
const sha3 = new Keccak(256)
const web3 = require('Web3')

const input = process.argv[2]

if (input.substring(0, 2) === '0x'){
  const buf = new Buffer.alloc(32)

  const inputBuf = Buffer.from(input.substring(2), 'hex')

  console.log(inputBuf)

  inputBuf.copy(buf, 32 - inputBuf.length)

  console.log(buf)

  console.log(web3.utils.bytesToHex(sha3.update(buf).digest()))

} else {
  console.log(web3.utils.bytesToHex(sha3.update(process.argv[2]).digest()))
}

// console.log(web3.utils.bytesToHex(sha3.update(process.argv[2]).digest()))


const { Keccak } = require('sha3')
const sha3 = new Keccak(256)
const Web3 = require('web3')

function namehash(input){
  if (input === ''){
    return new Buffer.alloc(32)
  }

  const inputSplit = input.split('.')

  const label = inputSplit.shift()
  const remainder = inputSplit.join('.')

  const labelSha3 = sha3.update(label).digest()

  sha3.reset()

  const iter = sha3.update(Buffer.concat([namehash(remainder), labelSha3])).digest()
  sha3.reset() // TODO: figure out why this needs to be here
  return iter
}

function hash(input){
  return Web3.utils.bytesToHex(namehash(input))
}

module.exports = { hash }

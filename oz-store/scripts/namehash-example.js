const namehash = require('eth-ens-namehash')
const { Keccak } = require('sha3')
const web3 = require('Web3')
const _ = require('lodash')
const sha3 = new Keccak(256)

function namehash2(input){
  if (input === ''){
    return new Buffer.alloc(32)
  }

  sha3.reset()

  const inputSplit = input.split('.')

  const label = inputSplit.shift()
  const remainder = inputSplit.join('.')

  const labelSha3 = sha3.update(label).digest()

  sha3.reset()

  const iter = sha3.update(Buffer.concat([namehash2(remainder), labelSha3])).digest()
  sha3.reset() // TODO: figure out why this needs to be here
  return iter
}

if (process.argv.length > 2){
  console.log(web3.utils.bytesToHex(namehash2(process.argv[2])))
  process.exit(1)
}

console.log('\n\nTEST')

sha3.reset()

/**
 * This demonstrates how namehash works
 *
 * - bytes32 are represented as 64 char hex strings,
 *   the 0x is automatically removed when using web3.utils.hexToBytes
 *
 * - from bytes to hex, always use web3.utils.bytesToHex, otherwise
 *   you need prepend 0x for consistency
 */

// BASE EXAMPLE
const baseHash = namehash.hash('')
console.log(web3.utils.bytesToHex(new Buffer.alloc(32)))
console.log(baseHash)
// 0x0000000000000000000000000000000000000000000000000000000000000000

//web3.utils.hexToByte automatically ignores the 0x
const baseHashBuf = Buffer.from(web3.utils.hexToBytes(baseHash))
console.log(baseHashBuf) // node0
// <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
console.log(baseHashBuf.length)
// 32 (# of bytes)

console.log('\nSHA3 of ETH and FOO')

const ethSha3Buf = sha3.update('eth').digest() // this is a Buffer
console.log(web3.utils.bytesToHex(ethSha3Buf))

sha3.reset()

const fooSha3Buf = sha3.update('foo').digest() // this is a Buffer
console.log(web3.utils.bytesToHex(fooSha3Buf))

sha3.reset()

console.log('')

const node1 = sha3.update(Buffer.concat([baseHashBuf, ethSha3Buf])).digest()
console.log(node1)

// Following 2 must match
console.log(web3.utils.bytesToHex(node1))
// 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae
console.log(namehash.hash('eth'))
// 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae

sha3.reset()

console.log('')

/**
 * What's the point of all this?
 *
 * Each subdomain or node is a different hash, so typically we want to offchain compute these and store them
 * on the smart contract
 *
 * e.g.
 *
 * eth = 0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0
 * foo.eth = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae
 * bar.foo.eth = 0x...
 *
 * Each node could be resolved or handled by a different actual node, we start at the base registrar and need to
 * follow each hash to the next node or resolver.
 *
 * But the real reason this is advantageous is string manipulation, let's say I am at
 * sub.subdomain.example.eth and I need to fetch foo.sub.subdomain.example.eth, if I was in a smart contract
 * I would need to retrieve the full string sub.subdomain.example.eth and then concat "foo." and then hash that.
 *
 * Now since I already have the hash for "sub.subdomain.example.eth" I can just hash foo, then hash the entire thing
 * and I will have the hash for "foo.sub.subdomain.example.eth"
 *
 * So while namehash may seem rather elaborate, in Ethereum saving gas is paramount, I can pre-hash and do string
 * manipulation off-chain and pass those in.
 */
const node2 = sha3.update(Buffer.concat([node1, fooSha3Buf])).digest()
console.log(node2)

// Following 2 must match
console.log(web3.utils.bytesToHex(node2))
// 0xde9b09fd7c5f901e23a3f19fecc54828e9c848539801e86591bd9801b019f84f
console.log(namehash.hash('foo.eth'))
// 0xde9b09fd7c5f901e23a3f19fecc54828e9c848539801e86591bd9801b019f84f


console.log(namehash.hash('sub.foo.eth'))

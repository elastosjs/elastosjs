
const chai = require('chai')
const expect = chai.expect

const namehashOfficial = require('eth-ens-namehash')
const namehash = require('../scripts/namehash')

describe('Tests for Namehash', () => {

  it('Should match final namehash for foo.eth', async () => {

    const TEST_STR = 'foo.eth'

    expect(namehash.hash(TEST_STR)).to.be.equals(namehashOfficial.hash(TEST_STR))

  })

})

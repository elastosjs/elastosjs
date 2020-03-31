const data = require('./data')
const { defaultFromAccount, ether, isRelayReady, waitForRelay } = require('./helpers')
const { merge } = require('lodash')
const axios = require('axios')

async function registerRelay(web3, options = {}) {
  const defaultOptions = {
    relayUrl: 'https://gsn-relayer.elastosjs.com',
    relayHubAddress: data.relayHub.address,
    stake: ether('1'),
    unstakeDelay: 604800, // 1 week
    funds: ether('0.2'),
    from: await defaultFromAccount(web3, options && options.from),
  }

  options = merge(defaultOptions, options)

  try {
    if (await isRelayReady(options.relayUrl)) {
      return
    }
  } catch (error) {
    throw Error(`Could not reach the relay at ${options.relayUrl}, is it running?`)
  }

  try {
    console.error(`Funding GSN relay at ${options.relayUrl}`)

    const response = await axios.get(`${options.relayUrl}/getaddr`)
    const relayAddress = response.data.RelayServerAddress

    console.log(`relayAddress = ${relayAddress}`)

    const relayHub = new web3.eth.Contract(data.relayHub.abi, options.relayHubAddress, {gas: 8000000, gasPrice: web3.utils.toWei('1', 'gwei')})

    await relayHub.methods
      .stake(relayAddress, options.unstakeDelay.toString())
      .send({ value: options.stake, from: options.from })

    console.log('staked')

    await web3.eth.sendTransaction({
      from: options.from,
      to: relayAddress,
      value: options.funds,
    })

    console.log('send funds')

    await waitForRelay(options.relayUrl)

    console.error(`Relay is funded and ready!`)
  } catch (error) {
    throw Error(`Failed to fund relay: '${error}'`)
  }
}

module.exports = {
  registerRelay,
}

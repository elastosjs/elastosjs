/*
****************************************************************************************
* NO LONGER USED BECAUSE WE HAVE NO WEBSOCKET YET
****************************************************************************************
 */

// import Web3 from 'web3'

// import ELAJSStore from "../contracts/ELAJSStore-development.json"

// import constants from '../constants'

/**
 * We have this file mainly to keep all the contracts in one place
 *
 * @param network
 * @param web3
 * @returns {{silent: boolean, web3: {block: boolean, customProvider: Web3 | null | module:querystring | string}, polls: {accounts: number}}}
 */
const options = (network, web3) => {

  /*
  let web3

  switch (network){
    case constants.NETWORK.LOCAL:
      web3 = new Web3(FortmaticNodeOptions[constants.NETWORK.LOCAL].rpcUrl)
      break

    case constants.NETWORK.TESTNET:
      web3 = new Web3(FortmaticNodeOptions[constants.NETWORK.TESTNET].rpcUrl)
      break

    case constants.NETWORK.MAINNET:
      web3 = new Web3(FortmaticNodeOptions[constants.NETWORK.MAINNET].rpcUrl)
      break

  }
  */

  return {
    web3: {
      block: false,
      customProvider: web3.lib
    },
    // contracts: [ELAJSStore],
    polls: {
      accounts: 15000,
      blocks: 15000
    },
    silent: true
  }
}

export default options

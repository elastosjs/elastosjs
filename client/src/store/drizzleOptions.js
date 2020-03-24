import Web3 from 'web3'

// import Box from "../contracts/Box.json"

import constants from '../constants'


const options = (network, FortmaticNodeOptions) => {

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

  return {
    web3: {
      block: false,
      customProvider: web3
    },
    // contracts: [Box],
    polls: {
      accounts: 5000
    }
  }
}

export default options

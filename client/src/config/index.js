

import constants from '../constants'

import contractsLocal from './local'
import contractsTestnet from './testnet'

const colors = {
  primary_color: '#0b687c',
  primary_color_light: '#318197',

  secondary_color: '#1c2f4a',
  tertiary_color: '#4f789c',

  ela_red: '#9b5f52'
}

const contracts = {
  [constants.NETWORK.LOCAL]: contractsLocal,
  [constants.NETWORK.TESTNET]: contractsTestnet
}

const FortmaticAPIKey = {
  [constants.NETWORK.LOCAL]: 'pk_test_55B6D44CB39F9CD8',
  [constants.NETWORK.TESTNET]: 'pk_test_55B6D44CB39F9CD8',
  [constants.NETWORK.MAINNET]: 'pk_live_CB781950FDA18ED6'
}

const FortmaticNodeOptions = {
  [constants.NETWORK.LOCAL]: {
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 1588066097663
  },
  [constants.NETWORK.TESTNET]: {
    rpcUrl: 'https://rpc.elaeth.io',
    chainId: 21
  },
  [constants.NETWORK.MAINNET]: {
    rpcUrl: 'https://mainrpc.elaeth.io',
    chainId: 20
  }
}

export {
  colors,
  contracts,
  FortmaticAPIKey,
  FortmaticNodeOptions
}

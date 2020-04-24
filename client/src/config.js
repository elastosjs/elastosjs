
import constants from './constants'

const colors = {
  primary_color: '#0b687c',
  primary_color_light: '#318197',

  secondary_color: '#1c2f4a',
  tertiary_color: '#4f789c',

  ela_red: '#9b5f52'
}

const contracts = {
  [constants.NETWORK.LOCAL]: { elajsStore: '0xb113d904f84950c7b1C8663fAB9baa1d8095b1e2' },
  [constants.NETWORK.TESTNET]: { elajsStore: '0xE90B0eB7e7CBf32936efde534DacfE2257DcD093' }
}

export {
  colors,
  contracts
}

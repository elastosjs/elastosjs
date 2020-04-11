
import constants from './constants'

const colors = {
  primary_color: '#0b687c',
  primary_color_light: '#318197',

  secondary_color: '#1c2f4a',
  tertiary_color: '#4f789c',

  ela_red: '#9b5f52'
}

const contracts = {
  [constants.NETWORK.LOCAL]: {
    counterEla: '0xadBB95e5C488930495D9F15ADaAeffc138DFc689',
    elajsStore: '0x8096f0c657B1111caaBE7059e7DE2E9428d7Ca26'
  }
}

export {
  colors,
  contracts
}


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
    elajsStore: '0x592c129085b61A3110Ebd1DCD99F3Cfe97A54dF3'
  }
}

export {
  colors,
  contracts
}

import { Drizzle, generateStore } from "@drizzle/store"
import DrizzleOptions from "./drizzleOptions"
import thunk from 'redux-thunk'
import { contractEventNotifier, contractAddNotifier } from "../middleware"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import Fortmatic from 'fortmatic'
import Web3 from "web3"

import reducers from './reducers'

import constants from '../constants'

const FortmaticNodeOptions = {
  [constants.NETWORK.LOCAL]: {
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 1584842682536
  },
  [constants.NETWORK.TESTNET]: {
    rpcUrl: 'https://rpc.elaeth.io',
    chainId: 3
  },
  [constants.NETWORK.MAINNET]: {
    rpcUrl: 'https://mainrpc.elaeth.io',
    chainId: 1
  }
}

const FormaticAPIKey = {
  [constants.NETWORK.LOCAL]: 'pk_test_0E66799043CB51BC',
  [constants.NETWORK.TESTNET]: 'pk_test_0E66799043CB51BC',
  [constants.NETWORK.MAINNET]: 'pk_live_CB781950FDA18ED6'
}


export const fm = new Fortmatic('pk_test_AC45B19FD10F3B40', FortmaticNodeOptions)


const getEthConfig = (network) => {

  const fm = new Fortmatic(FormaticAPIKey[network], FortmaticNodeOptions[network])
  const fmWeb3 = new Web3(fm.getProvider())

  // Drizzle uses a direct web3 connection, not Fortmatic
  // this web3 is meant to call the relayer for verified ethAddresses in AWS Cognito
  const drizzleOptions = DrizzleOptions(network, FortmaticNodeOptions)

  const persistConfig = {
    key: 'root',
    storage,
  }

  const appReducers = {
    // todo rename this to root
    root: persistReducer(persistConfig, reducers),
  }

  const appMiddlewares = [thunk.withExtraArgument({fm}), contractEventNotifier, contractAddNotifier]

  const config = {
    drizzleOptions,
    appReducers,
    appMiddlewares,
    disableReduxDevTools: false // enable ReduxDevTools!
  }
  const store = generateStore(config)

  const persistor = persistStore(store)

  const drizzle = new Drizzle(drizzleOptions, store)

  return {
    fm,
    fmWeb3,
    store,
    persistor,
    drizzle
  }
}

export default getEthConfig


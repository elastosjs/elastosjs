
import { Drizzle, generateStore } from "@drizzle/store"
// import DrizzleOptions from "./drizzleOptions"
import thunk from 'redux-thunk'
import { contractEventNotifier, contractAddNotifier } from "../middleware"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import {reducer as toastrReducer} from 'react-redux-toastr'

import Fortmatic from 'fortmatic'
import Web3 from "web3"
import { GSNProvider } from '@openzeppelin/gsn-provider'

import { fromConnection, ephemeral } from "@openzeppelin/network"

import { elajs } from 'ela-js'

import reducers from './reducers'

import constants from '../constants'
import {
  contracts,
  FortmaticAPIKey,
  FortmaticNodeOptions
} from '../config'



/**
 * ~We have TWO web3 instances,~
 *
 * 1. ozWeb3 is from OpenZepplin and is used by Drizzle, it has no ether and uses an ephemeral key to sign GSN transactions for ElastosJS
 * 2. fmWeb3 is from Fortmatic and is linked to the developer/user on ElastosJS, this is used by them to deploy their own SQL Smart Contracts
 *
 * @param network
 */
const getEthConfig = async (network) => {

  const fm = new Fortmatic(FortmaticAPIKey[network], FortmaticNodeOptions[network])
  const gsnProvider = new GSNProvider(fm.getProvider())
  const fmWeb3 = new Web3(gsnProvider)

  // GSN uses a special web3 too
  const ozWeb3 = await fromConnection(FortmaticNodeOptions[network].rpcUrl, {
    gsn: { signKey: ephemeral() },
    pollInterval: 5000
  })

  // Drizzle uses a direct web3 connection, not Fortmatic
  // this web3 is meant to call the relayer for verified ethAddresses in AWS Cognito
  // TODO: undisable this once we have subscriptions/websocket
  // const drizzleOptions = DrizzleOptions(network, ozWeb3)

  /*
  ***********************************************************************************************************************
  * ELA_JS Setup
  ***********************************************************************************************************************
   */
  const elajsDb = new elajs.database({
    defaultWeb3: fmWeb3,
    ephemeralWeb3: ozWeb3,
    contractAddress: contracts[network].elajsStoreAddr
  })

  /*
  ***********************************************************************************************************************
  * Dynamic ELA_JS Setup
  * This one is used for the user's smart contracts
  ***********************************************************************************************************************
   */
  const elajsUser = new ELA_JS({
    defaultWeb3: fmWeb3,
    ephemeralWeb3: ozWeb3
  })

  const persistConfig = {
    key: 'root',
    storage,
  }

  const appReducers = {
    // todo rename this to root
    toastr: toastrReducer,
    root: persistReducer(persistConfig, reducers),
  }

  const appMiddlewares = [thunk.withExtraArgument({fm}), contractEventNotifier, contractAddNotifier]

  const config = {
    // drizzleOptions,
    appReducers,
    appMiddlewares,
    disableReduxDevTools: false // enable ReduxDevTools!
  }
  const store = generateStore(config)

  const persistor = persistStore(store)

  // const drizzle = new Drizzle(drizzleOptions, store)

  return {
    fm,
    fmWeb3,
    ozWeb3,
    gsnProvider,
    store,
    persistor,
    // drizzle,
    elajs,
    elajsUser,

    ready: true
  }
}

export default getEthConfig


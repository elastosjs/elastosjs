import { useState, useContext } from 'React'
import { EthContext } from '../context/EthContext'
import React from 'react'

export const EthContext = React.createContext([{}, noop()])

export const useEthConfig = () => {

  const [ethConfig, setEthConfig] = useState({
    fm: null,
    fmWeb3: null,
    store: null,
    persistor: null,
    drizzle: null,
    elajs: null,
    elajsUser: null,

    ready: false
  })

  return {
    ethConfig,
    setEthConfig
  }
}

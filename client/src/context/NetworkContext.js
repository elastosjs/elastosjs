import React, { useState } from 'react'
import constants from '../constants'

const DEFAULT_NETWORK = constants.NETWORK.LOCAL

// the context is an array with a struct and fn to set that struct
const NetworkContext = React.createContext([null, noop()])

const NetworkProvider = (props) => {

  const [network, setNetwork] = useState(DEFAULT_NETWORK)

  return (
    <NetworkContext.Provider value={[network, setNetwork]}>
      {props.children}
    </NetworkContext.Provider>
  )
}

export { NetworkContext, NetworkProvider }

function noop() {}

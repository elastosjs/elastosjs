import React, { useState } from 'react'

// the context is an array with a struct and fn to set that struct
const EthContext = React.createContext([{}, noop()])

const EthProvider = (props) => {

  const [ethConfig, setEthConfig] = useState({

    fmWeb3: null,
    ozWeb3: null,
    store: null,

    ready: false
  })

  return (
    <EthContext.Provider value={[ethConfig, setEthConfig]}>
      {props.children}
    </EthContext.Provider>
  )
}

export { EthContext, EthProvider }

function noop() {}

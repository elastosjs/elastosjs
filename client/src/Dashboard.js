import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DrizzleContext } from '@drizzle/react-plugin'

import constants from './constants'

import getEthConfig from './store'

import Loading from './views/Pages/Loading'

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));


// Testnet/Mainnet Context
// const NetworkContext = React.createContext(constants.NETWORK.TESTNET);

const Dashboard = (props) => {

  const [network, setNetwork] = useState(constants.NETWORK.TESTNET)
  const [ethConfig, setEthConfig] = useState({
    fm: null,
    fmWeb3: null,
    store: null,
    persistor: null,
    drizzle: null,

    ready: false
  })

  useEffect(() => {
    let networkEthConfig = getEthConfig(network)

    setEthConfig({
      ready: true,
      ...networkEthConfig
    })

  }, [network])

  return (
    !ethConfig.ready ?
    <Loading/> :
      <Provider store={ethConfig.store}>
        <DrizzleContext.Provider store={ethConfig.store} drizzle={ethConfig.drizzle}>
          <PersistGate loading={Loading()} persistor={ethConfig.persistor}>
            <React.Suspense fallback={Loading()}>
              <HashRouter>
                <Switch>
                  <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>}/>
                  <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>}/>
                  <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>}/>
                  <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>}/>
                  <Route exact path="/dashboard" name="Home" render={props => <DefaultLayout {...props}/>}/>
                </Switch>
              </HashRouter>
            </React.Suspense>
          </PersistGate>
        </DrizzleContext.Provider>
      </Provider>

  )
}

export default Dashboard

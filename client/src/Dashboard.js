import React, { useState, useEffect, useContext } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DrizzleContext } from '@drizzle/react-plugin'

import constants from './constants'

import getEthConfig from './store'

import { EthContext } from './context/EthContext'
import { NetworkContext } from './context/NetworkContext'

import Loading from './views/Pages/Loading'

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

/**
 * This is setup so if `network` changes, we fetch a new EthConfig
 * and then update the context
 */
const Dashboard = () => {

  // We want to keep this out of redux since it resets Drizzle
  const [network, setNetwork] = useContext(NetworkContext)
  const [ethConfig, setEthConfig] = useContext(EthContext)

  // fetch the ETH config only if the network changes
  useEffect( () => {
    (async () => {
      const networkEthConfig = await getEthConfig(network)

      setEthConfig({
        ready: true,
        ...networkEthConfig
      })
    })()
  }, [network])

  console.log(`network = ${network}`)

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

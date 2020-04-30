import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Loading from './views/Pages/Loading'

import './App.scss';
import './scss/override.scss';

import Splash from './views/Pages/Splash'
import Learn from './views/Pages/Learn'
import Dashboard from './Dashboard'

import { NetworkProvider } from './context/NetworkContext'
import { EthProvider } from './context/EthContext'

const App = (props) => {

  return (
    <NetworkProvider>
      <EthProvider>
        <HashRouter>
          <React.Suspense fallback={Loading()}>
            <Switch>
              <Route exact path="/" name="Splash" component={Splash}/>
              <Route exact path="/learn" name="Learn" component={Learn}/>
              <Route name="Dashboard" component={Dashboard}/>
            </Switch>
          </React.Suspense>
        </HashRouter>
      </EthProvider>
    </NetworkProvider>
  )
}

export default App

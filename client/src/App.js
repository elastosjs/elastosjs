import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';

import Loading from './views/Pages/Loading'

import './App.scss';
import './scss/override.scss';

import Splash from './views/Pages/Splash'
import Dashboard from './Dashboard'

// const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

const App = (props) => {

  return (
    <HashRouter>
      <React.Suspense fallback={Loading()}>
        <Switch>
          <Route exact path="/" name="Splash" component={Splash}/>
          <Route name="Dashboard" component={Dashboard}/>
        </Switch>
      </React.Suspense>
    </HashRouter>
  )

}

export default App

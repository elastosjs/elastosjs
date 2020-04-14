import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import * as router from 'react-router-dom'
import { Container } from 'reactstrap'

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react'
// sidebar nav config
import { useNavigation } from '../../hooks/useNavigation'
// routes config
import routes from '../../routes'
import { connect } from 'react-redux'
import { ProfileActionTypes } from '../../store/redux/profile'

import Loading from '../../views/Pages/Loading'

const DefaultAside = React.lazy(() => import('./DefaultAside'))
const DefaultFooter = React.lazy(() => import('./DefaultFooter'))
const DefaultHeader = React.lazy(() => import('./DefaultHeader'))

const DefaultLayout = (props) => {

  const [ready, setReady] = useState(false)

  const nav = useNavigation(props.profile)

  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  const signOut = useCallback((ev) => {

    ev && ev.preventDefault()

    props.dispatch({
      type: ProfileActionTypes.SET_CREDENTIALS,
      username: '',
      ethAddress: ''
    })

    window.location.hash = ''
    window.location.href = '/'
  }, [])

  useEffect(() => {

    if (nav) {
      setReady(true)
    }

  }, [nav])

  if (props.profile.username === '' || props.profile.ethAddress === ''){
    signOut()
    return
  }

  return (!ready ?
    <Loading/> :
    <div className="app">
      <AppHeader fixed>
        <Suspense  fallback={loading()}>
          <DefaultHeader onLogout={signOut}/> {/* setNetwork={props.setNetwork} onLogout={signOut}/> */}
        </Suspense>
      </AppHeader>
      <div className="app-body">
        <AppSidebar fixed display="lg">
          <AppSidebarHeader />
          <AppSidebarForm />
          <Suspense>
          <AppSidebarNav navConfig={nav} router={router}/> {/*{...props} router={router}/>*/}
          </Suspense>
          <AppSidebarFooter />
          <AppSidebarMinimizer />
        </AppSidebar>
        <main className="main">
          <AppBreadcrumb appRoutes={routes} router={router}/>
          <Container fluid>
            <Suspense fallback={loading()}>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <route.component {...props} />
                      )} />
                  ) : (null)
                })}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </Suspense>
          </Container>
        </main>
        <AppAside fixed>
          <Suspense fallback={loading()}>
            <DefaultAside />
          </Suspense>
        </AppAside>
      </div>
      {/*
      <AppFooter>
        <Suspense fallback={this.loading()}>
          <DefaultFooter />
        </Suspense>
      </AppFooter>
      */}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(DefaultLayout)

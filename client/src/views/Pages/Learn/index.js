
import React from 'react'

import { Col } from 'reactstrap';

import SplashHeader from '../Splash/SplashHeader'
import SplashFooter from '../Splash/SplashFooter'

import '../Splash/splash.scss'

const Learn = (props) => {

  return (
    <div className="splash">
      <SplashHeader/>

      <SplashFooter/>
    </div>
  )
}

export default Learn

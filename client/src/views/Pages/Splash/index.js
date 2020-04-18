
import React from 'react'

import styled from 'styled-components'

import SplashCover from './SplashCover'
import SplashHeader from './SplashHeader'
import SplashFooter from './SplashFooter'

import './splash.scss'


const Splash = (props) => {

  return (
    <div className="splash">
      <SplashHeader/>
      <SplashCover {...props}/>

      {/* Only using this for the grey bar */}
      <div className="mainContainer"/>
      <SplashFooter/>

    </div>
  )
}

export default Splash


import React, { useState, useEffect } from 'react'

import SplashCover from './SplashCover'
import SplashHeader from './SplashHeader'

import './splash.scss'

const Splash = (props) => {

  return (
    <div className="splash">
      <SplashHeader/>
      <SplashCover {...props}/>
      <div className="mainContainer">

      </div>
    </div>
  )
}

export default Splash

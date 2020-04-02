
import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardGroup, Col, Progress, Row } from 'reactstrap';

import styled from 'styled-components'

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
      <NavFooter className="nav-footer" id="footer">
        <section className="row" style={{paddingLeft: '25px', paddingTop: '45px'}}>
          <Col lg="4">
            <h5>Developer Resources</h5>
            <a href="https://developer.elastos.org" target="_blank">
              Official Developer Site
            </a>
            <a href="https://elastos.academy" target="_blank">
              Elastos Academy
            </a>
            <a href="https://www.elastos.org" target="_blank">
              Elastos Official Website
            </a>
            <a href="https://github.com/elastos" target="_blank">
              Elastos Github
            </a>
          </Col>
          <Col lg="4">
            <h5>Community</h5>
            <a href="https://t.me/elastosdev" target="_blank">
              Developers Telegram
            </a>
            <a href="https://t.me/elastosgroup" target="_blank">
              Elastos Telegram
            </a>
            <a href="https://twitter.com/Cyber__Republic" target="_blank">
              Twitter
            </a>
            <a href="https://www.reddit.com/r/Elastos" target="_blank">
              Reddit
            </a>
            <a href="mailto:contact@cyberrepublic.org" target="_blank">
              Contact Us
            </a>
          </Col>
          <Col lg="4">
            <h5>More</h5>
            <a href="https://news.elastos.org" target="_blank">Elastos News</a>
            <a href="https://elanews.net" target="_blank">Community News</a>
            <a href="https://github.com/cyber-republic/elastosjs" target="_blank">Our GitHub</a>
            {/*<a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
            */}
          </Col>
        </section>

        <section className="center text-white">
          This is a community developed website, all information, materials and views expressed are not that of Elastos Foundation.
        </section>
        <section className="copyright text-muted center">Copyright © 2020 CyberRepublic ETH Task Force</section>
      </NavFooter>
    </div>
  )
}

export default Splash

const NavFooter = styled.footer`
  background-image: url('/assets/bg/industry_identity_bg.png');
  background-size: cover;
  background-position: center top;
  
  color: white;
  
  > section {
    padding: 12px 0;
    max-width: 1080px;
    margin: 0 auto;
    
    > div {
      
      > a {
        color: rgba(255, 255, 255, 0.6);
        margin: 6px 0;
        display: block;
      }
      
    }
  }
`

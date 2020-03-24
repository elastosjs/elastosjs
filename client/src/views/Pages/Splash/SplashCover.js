import React from 'react'
import MarkdownBlock from '../../../containers/MarkdownBlock'

export default class SplashCover extends React.Component {

  render() {

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    )

    const Logo = props => (
      <div className="projectLogo">
        <img src="/assets/img/Elastos_Icon_RGB.png" alt="Project Logo" />
      </div>
    )

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        <img src="/assets/img/elastosJS.svg" alt="Elastos Logo" width="25%"/>
        <small></small>
      </h2>
    )

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    )

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    )

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig="ElastosJS" />
          <PromoSection>
            <Button href="getting-started/intro.html">Get Started</Button>
            <Button href="bounty/index.html"><b>Calling Developers:</b> Port Your ETH DApp</Button>
            <Button href="bounty/funding.html">Get Funded By Cyber Republic</Button>
          </PromoSection>
        </div>

        {/* STEP 1 - Sign-Up for a Developer Account */}

        {/* STEP 2 - Deploy a Storage Smart Contract per App */}

        {/* STEP 3 - Add the Contract Address to the ElastosJS SDK */}

        {/* STEP 4 - Users who use your app get gas fees paid by your account */}

        <div className="inner">
          <MarkdownBlock>
            `Hello World`
          </MarkdownBlock>
        </div>
      </SplashContainer>
    )
  }
}

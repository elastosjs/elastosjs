import React from 'react'
import { Card, CardBody, CardGroup, Col, Progress, Row } from 'reactstrap';
import styled from 'styled-components'

import ElastosMergeImg from '../../../assets/img/elastos_merge_2.png'
import MetamaskLogo from '../../../assets/img/metamask-logo-eyes.png'

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
        <img src="/assets/img/elastosJS.svg" alt="Elastos Logo"/>
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

    const Hero = () => (
      <div className="animated fadeIn">
        <Row>
          {/* STEP 1 - Sign-Up for a Developer Account */}
          <Col lg="3" className="d-flex">
            <Card style={{width: '100%'}}>
              <CardBody>
                <h5 className="text-black-50 m-0">1.</h5>
                <h4>Sign-Up for a Developer Account</h4>
                <Progress className="mb-4" color="success" value="25" />
                <small className="text-muted">DEPLOY STORAGE SMART CONTRACTS</small>
                <List>
                  <li>Access a familiar DB admin for storage smart contracts</li>
                  <li>One-click deploy contracts</li>
                </List>
              </CardBody>
            </Card>
          </Col>
          {/* STEP 2 - Deploy a Storage Smart Contract per App */}
          <Col lg="3" className="d-flex">
            <Card style={{width: '100%'}}>
              <CardBody>
                <h5 className="text-black-50 m-0">2.</h5>
                <h4>Deploy Gasless Smart Contracts</h4>
                <Progress className="mb-4" color="primary" value="50" />
                <small className="text-muted text-uppercase">Leverage OZ Gas Station Network</small>
                <List>
                  <li>Let your users onboard to your dApp for free</li>
                  <li>Built on <a target="_blank" href="https://docs.openzeppelin.com/learn/sending-gasless-transactions">OpenZeppelin GSN</a></li>
                </List>
              </CardBody>
            </Card>
          </Col>
          {/* STEP 3 - Add the Contract Address to the ElastosJS SDK */}
          <Col lg="3" className="d-flex">
            <Card style={{width: '100%'}}>
              <CardBody>
                <h5 className="text-black-50 m-0">3.</h5>
                <h4>Connect to Your Storage</h4>
                <CodeWrapper>
                  <code>
                    elajs.config({'{'}<br/>
                    &nbsp;&nbsp;contract: '0xfD...Df'<br/>
                    {'}'})<br/>
                    <br/>
                    elajs.select('...<br/>
                    &nbsp;&nbsp;.from('<br/>
                    &nbsp;&nbsp;.where('
                  </code>
                </CodeWrapper>
              </CardBody>
            </Card>
          </Col>
          {/* STEP 4 - Users who use your app get gas fees paid by your account */}
          <Col lg="3" className="d-flex">
            <Card style={{width: '100%'}}>
              <CardBody>
                <h5 className="text-black-50 m-0">4.</h5>
                <h4>You Pay For Gas Fees Instead</h4>
                <Progress className="mb-4" color="warning" value="75" />
                <small className="text-muted text-uppercase">Give Users the Best Experience</small>
                <List>
                  <li>Let your users onboard to your dApp for free</li>
                  <li>Use our GSN strategy or your own</li>
                  <li>Learn more about <a href="">GSN</a></li>
                </List>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )

    const ElastosETH = () => (
      <ElastosETHContainer className="p-5">
        <img style={{float: 'right', width: '25%'}} src={MetamaskLogo}/>
        <Row>
          <Col sm="6">
            <span className="normal" style={{'fontSize': '20px'}}>Elastos is building equivalent versions of your favorite tools</span>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <span className="normal">Block Explorer</span> &#x27A1; use our testnet block explorer at <a href="https://testnet.elaeth.io" target="_blank">https://testnet.elaeth.io</a>, mainet at <a href="https://explorer.elaeth.io" target="_blank">https://explorer.elaeth.io</a>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <span className="normal">MetaMask</span> &#x27A1; directly works on our new RPC port at <a href="https://rpc.elaeth.io" target="_blank">https://rpc.elaeth.io</a>(testnet) and <a href="https://rpc.elaeth.io" target="_blank">https://mainrpc.elaeth.io</a>(mainnet)
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <span className="normal">Remix</span> &#x27A1; same as above, point it at our new RPC port
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <span className="normal">Myetherwallet</span> &#x27A1; accessible at <a href="https://wallet.elaeth.io" target="_blank">https://wallet.elaeth.io</a>
          </Col>
        </Row>
        {/*
        <Row>
          <Col>
            <a className="btn btn-primary" href="#">View Our Advanced Tutorial for Ethereum Developers</a>
          </Col>
        </Row>
        */}
      </ElastosETHContainer>
    )

    const ElastosBuild = () => (
      <ElastosBuildContainer className="p-5">
        <Row>
          <Col sm="5">
            <img style={{width: '100%'}} src={ElastosMergeImg}/>
          </Col>
          <Col sm="7">
            <span className="normal" style={{'fontSize': '20px', 'fontWeight': '600'}}>Build on the Modern Internet</span>
            <br/>
            <br/>
            <List>
              <li>
                Elastos is open source with over 100 repos - github.com/elastos
              </li>
              <li>
                Our Ethereum Sidechain is only one of multiple services, including Elastos Carrier (P2P decentralized persistent), Elastos Hive (IPFS/Storage Solutions) and more.
              </li>
              <li>
                We are a global network of over 70 developers building the Modern Internet
              </li>
            </List>

            <a href="https://t.me/elastosgroup" target="_blank">
              <button className="btn btn-primary text-uppercase">Join Us On Telegram <i className="fa fa-telegram"/></button>
            </a>

            <a href="https://elastos.academy" target="_blank" style={{marginLeft: '15px'}}>
              <button className="btn btn-elastos text-uppercase">Learn More @ Elastos.Academy</button>
            </a>
          </Col>
        </Row>


        {/*
        <Row>
          <Col>
            <a className="btn btn-primary" href="#">View Our Advanced Tutorial for Ethereum Developers</a>
          </Col>
        </Row>
        */}
      </ElastosBuildContainer>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <TitleInfo className="TitleInfo">
            <Row>
              <Col sm="5">
                Elastos ETH Testnet web3 RPC:
              </Col>
              <Col sm="7" className="text-right">
                <code className="ml-2">
                  https://rpc.elaeth.io
                </code>
              </Col>
            </Row>
            <Row>
              <Col sm="5">
                Connect to our Mainnet at:
              </Col>
              <Col sm="7" className="text-right">
                <code className="ml-2">
                  https://mainrpc.elaeth.io
                </code>
              </Col>
            </Row>
            <Row>
              <Col sm="5">
                Block Explorer:
              </Col>
              <Col sm="7" className="text-right">
                <code className="ml-2">
                  https://explorer.elaeth.io
                </code>
              </Col>
            </Row>
            <Row>
              <Col sm="5">
                Testnet Faucet:
              </Col>
              <Col sm="7" className="text-right">
                <code className="ml-2">
                  https://faucet.elaeth.io
                </code>
              </Col>
            </Row>
            <Row>
              <Col>
                <br/>
                <h4>IMPORTANT NOTE: <code>--evm-version byzantium</code></h4>
              </Col>
            </Row>
            {/*
            <hr/>
            <Row>
              <Col style={{'white-space': 'normal'}}>
                To transfer ELA from the Elastos mainchain to the<br/>
                ETH Sidechain mainnet make an account and use our dashboard
              </Col>
            </Row>
            */}
          </TitleInfo>

          <ProjectTitle siteConfig="ElastosJS" />

          <TitleMarkdownBlock className="my-5 pl-3">

            A complete storage and Javascript SDK to get started on Elastos
            <br/>
            <br/>

            <code>
              import elajs from 'elastosjs'
            </code>
          </TitleMarkdownBlock>

          <PromoSection>
            <Button target="_blank" href="https://docs.elastosjs.com">Get Started</Button>
            <Button href="#"><b>Calling Developers:</b> Port Your ETH DApp</Button>
            <Button target="_blank" href="https://www.cyberrepublic.org">Get Funded By Cyber Republic</Button>
          </PromoSection>
        </div>

        <br/>

        {/* The 4 boxes */}
        <Hero/>

        <ElastosETH/>

        <ElastosBuild/>

      </SplashContainer>
    )
  }
}

const TitleMarkdownBlock = styled.div`
  code {
    font-size: 110%;
  }
`

const List = styled.ul`
  padding-left: 16px;

  li {
    margin-top: 4px;
    margin-left: 8px;
    font-weight: 400;
  }
`

const CodeWrapper = styled.div`
  background-color: rgba(27, 31, 35, 0.05);

  padding: 8px;

  > code {
    padding-left: 0;
  }
`
const TitleInfo = styled.div`
  overflow: visible;
  padding: 16px 24px;
  box-sizing: border-box;
  background-color: #222;
  border-radius: 8px;
  float: right;
  color: white;
  white-space: nowrap;

  .row {
    margin-bottom: 8px;
  }

  code {
    word-break: keep-all;
    color: white;
  }
`

const ElastosETHContainer = styled.div`
  background-position: center;
  background-image: url('/assets/bg/footer_bg_3.png');

  font-family: "Bio Sans", sans-serif;
  font-weight: 300;
  color: white;

  font-size: 16px;

  .row {
    margin-bottom: 16px;
  }
`


const ElastosBuildContainer = styled.div`

  font-family: "Bio Sans", sans-serif;
  font-weight: 300;

  font-size: 16px;

  .row {
    margin-bottom: 16px;
  }
`



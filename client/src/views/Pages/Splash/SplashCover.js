import React from 'react'
import { CardGroup, Card, CardBody, CardHeader, Col, Progress, Row } from 'reactstrap';
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
        <img src="/assets/img/elajs.png" style={{height: '200px'}}  alt="Elastos Logo"/>
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

    /*
    ************************************************************************************************************************
    * HERO - 4 BOXES
    ************************************************************************************************************************
     */
    const Hero = () => (
      <div className="animated fadeIn my-3">
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
                    elajs.setDatabase({'{'}<br/>
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
                  <li>Learn more about <a target="_blank" href="https://docs.openzeppelin.com/gsn-provider/0.1/gsn-faq">GSN</a></li>
                </List>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )

    /*
    ************************************************************************************************************************
    * SECOND SECTION - GREEN
    ************************************************************************************************************************
     */
    const ElastosETH = () => (
      <ElastosETHContainer className="p-5 my-5">
        {/* <img style={{float: 'right', width: '25%'}} src={MetamaskLogo}/> */}
        <Row>
          <Col>
            <span className="normal" style={{textTransform: 'uppercase', 'fontSize': '20px'}}>
              A Cheaper, More Secure, Ethereum-Based Blockchain
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <CardGroup>
              <Card className="mx-3">
                <CardHeader>
                  <h2>1 ELA = 1 ETH</h2>
                </CardHeader>

                <CardBody>
                  Our ELA token is over 100x cheaper than ETH, at that ratio running your smart contracts is a lot
                  more inexpensive, enabling more uses for Solidity.
                </CardBody>
              </Card>
              <Card className="mx-3">
                <CardHeader>
                  <h2>More Gas Per Block</h2>
                </CardHeader>
                <CardBody>
                  We use dPoS instead of PoW allowing us to process more transactions per block and adjust gas limits dynamically based on demand.
                </CardBody>
              </Card>
              <Card className="mx-3">
                <CardHeader>
                  <h2>50%+ BTC Hashrate</h2>
                </CardHeader>
                <CardBody>
                  Our main Elastos chain secures the ETH sidechain with over 50% of BTC's hashrate giving more security than even Ethereum.
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
        <Row>

        </Row>
        <Row>
          <Col>
            Our ETH Sidechain is only one component of an ecosystem of decentralized solutions.
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

    const ElastosETHContainer = styled.div`
      background-position: center;
      background-image: url('/assets/bg/footer_bg_3.png');
    
      font-family: "Bio Sans", sans-serif;
      font-weight: 400;
      color: white;
    
      font-size: 16px;
    
      .row {
        margin-bottom: 16px;
      }
      
      .card {
        text-align: center;
        color: #666;
        
        h2 {
          color: #222;
        }
      }
    `


    /*
    ************************************************************************************************************************
    * THIRD SECTION - BUILD ON THE MODERN INTERNET
    ************************************************************************************************************************
     */
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
                Elastos is open source with over 100 repos - <a target="_blank" href="https://github.com/elastos">github.com/elastos</a>
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
              <button className="btn btn-elastos text-uppercase">Learn More About Elastos @ Our Academy</button>
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

    const ElastOS = () => (
      <ElastOSContainer>
        <Row>

        </Row>
      </ElastOSContainer>
    )

    /*
    ************************************************************************************************************************
    * TOP SECTION
    ************************************************************************************************************************
     */
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

            A decentralized storage and Javascript SDK to get started on Elastos
            <br/>
            <br/>

            <code>
              import elajs from 'ela-js'
            </code>
          </TitleMarkdownBlock>

          <PromoSection>
            <Button target="_blank" href="https://tutorials.elastosjs.com"><b>Get Started</b></Button>
            {/* <Button href="/#/learn">The Elastos Blockchain</Button> */}
            <Button target="_blank" href="https://www.elastos.org">The Elastos Blockchain</Button>
            <Button target="_blank" href="https://www.cyberrepublic.org">The Cyber Republic DAO - <b>Get Funding</b></Button>
          </PromoSection>
        </div>

        <br/>

        {/* The 4 boxes */}
        <Hero/>

        <ElastosETH/>

        <ElastosBuild/>

        {/* <ElastOS/> */}

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



const ElastosBuildContainer = styled.div`

  font-family: "Bio Sans", sans-serif;
  font-weight: 300;

  font-size: 16px;

  .row {
    margin-bottom: 16px;
  }
`

const ElastOSContainer = styled.div`
  background-position: center;
  background-image: url('/assets/bg/ElastOS_Promo.png');
  background-size: 75%;
  background-repeat: no-repeat;

  font-family: "Bio Sans", sans-serif;
  font-weight: 300;
  color: white;
  
  height: 400px;
  
  font-size: 16px;

  .row {
    margin-bottom: 16px;
  }
`



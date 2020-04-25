import React, { useContext, useState, useCallback } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Col,
  Row,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText

} from 'reactstrap'
import { connect } from 'react-redux'
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import { toastr } from 'react-redux-toastr'
import { useEthBalance } from '../hooks/useEthBalance'
import { EthContext } from '../context/EthContext'
import { NetworkContext } from '../context/NetworkContext'
import constants from '../constants'

const AddFundsAcct = (props) => {

  const { ethBalance, walletAddress } = useEthBalance()

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [network, setNetwork] = useContext(NetworkContext)

  const [faucetClicked, setFaucetClicked] = useState(false)

  const copyWalletAddress = useCallback(() => {

    copy(walletAddress)
    toastr.info('Wallet Address Copied')

  }, [walletAddress])

  if (network === constants.NETWORK.LOCAL){
    return <div>
      <Row>
        <Col>
          <Card className="text-white bg-primary">
            <CardBody>
              <h3>
                The system setting is for a local blockchain deployment
              </h3>
              <br/>
              <p>
                If you are developing on elajs you can just send funds to the wallet through your ganache.
              </p>
              <p>
                If this is online there is an error - please contact us at <a href="mailto:contact@elajs.com">contact@elajs.com</a>
              </p>
            </CardBody>
          </Card>
          <button onClick={props.closeModal}>
            Close
          </button>
        </Col>
      </Row>
    </div>

  }

  if (network === constants.NETWORK.TESTNET){
    return <div>
      <Row>
        <Col>
          <Card className="text-white bg-primary">
            <CardBody>
              <h3>
                Adding funds on Testnet is easy:
              </h3>
              <br/>
              <p>
                1. Copy your ELASC Address below to your clipboard
              </p>
              <InputGroup>
                <Input type="text" readOnly value={walletAddress}/>
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <CopyIcon className="fa fa-copy fa-lg" onClick={copyWalletAddress}/>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <br/>
              <p>
                2. Click this link to go to the Elastos ETH Testnet Faucet, once there
                you can paste your address and you should receive your test ELASC within a minute.
              </p>
              <LinkContainer>
                <a target="_blank" href="https://faucet.elaeth.io" onClick={() => setFaucetClicked(true)}><b>https://faucet.elaeth.io</b></a>
              </LinkContainer>
            </CardBody>
          </Card>
          <button className={`btn ${faucetClicked ? 'btn-info' : 'btn-secondary'} pull-right`} onClick={props.closeModal}>
            {faucetClicked ? 'Close' : 'Cancel'}
          </button>
        </Col>
      </Row>
    </div>

  }

  /*
  **********************************************************************************************************************
  * Mainnet Dialog
  **********************************************************************************************************************
   */
  return <div>
    <Row>
      <Col>
        <Card className="text-white bg-danger">
          <CardHeader>
            Add ELASC - Caution You Are on Mainnet
          </CardHeader>
          <CardBody>
            <h3>
              The funds you add here should be treated as real money.
            </h3>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(AddFundsAcct)

const CopyIcon = styled.i`

  cursor: pointer;

  :hover {
    color: #007bff;
  }
`

const LinkContainer = styled.div`
  background-color: #e4e7ea;
  border-radius: 4px;
  padding: 6px 12px;
`

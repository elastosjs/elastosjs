import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal, ModalBody, ModalFooter, ModalHeader,
  Row
} from 'reactstrap'

import Loading, { LoadingOverlay } from '../Loading'
import styled from 'styled-components'

import { EthContext } from '../../../context/EthContext'
import { NetworkContext } from '../../../context/NetworkContext'

// import counterELAJSON from '../../../contracts/CounterELA.json'
import Web3 from 'web3'

import FortmaticLogo from '../../../assets/img/fortmatic_logo.svg'
import constants from '../../../constants'
import { contracts } from '../../../config'
import _ from 'lodash'

import { keccak256, namehash } from 'ela-js'

import ELAJStoreDev from '../../../contracts/ELAJSStore-development.json'
import { ProfileActionTypes } from '../../../store/redux/profile'
import { connect } from 'react-redux'


// TODO: DRY merge redundant code between this and Register pages
const Login = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)
  const [network, setNetwork] = useContext(NetworkContext)

  const [canLogin, setCanLogin] = useState(false)

  const [ethAddress, setEthAddress] = useState(false)

  const [loading, setLoading] = useState(false)

  const [elajsAcct, setElajsAcct] = useState({
    username: '',
    usernameInvalid: false,

    password: '',

    dataCommitted: false
  })

  // const ozWeb3 = ethConfig.ozWeb3

  const elajs = ethConfig.elajs

  /*
   ****************************************************************************************************************
   * Left Panel - Login
   ****************************************************************************************************************
   */
  const handleUsernameChange = useCallback((ev) => {
    const username = ev.target.value

    setElajsAcct({
      ...elajsAcct,
      username,
      usernameInvalid: !(username && username.length >= constants.PROFILE.USERNAME_MIN_LEN && validateUsername(username))
    })

  }, [elajsAcct])

  const handlePw = useCallback((ev) => {
    const pw = ev.target.value
    setElajsAcct({ ...elajsAcct, password: pw})
  }, [elajsAcct])

  const handleSaveAcct = useCallback(() => {

    let errors = []

    if (elajsAcct.username.length < 6 || elajsAcct.usernameInvalid){
      errors.push('Username is invalid')
    }

    if (elajsAcct.password.length < 8){
      errors.push('Password must be 8 chars or more')
    }

    // if at this point
    if (errors.length){
      setModalErrorData({ msgs: errors, isOpen: true })
      return
    }

    // if we reach here all is good with the registration fields
    toggleCommitAcct()

  }, [elajsAcct])

  /**
   * We commit the login fields by setting `elajsAcct.dataCommitted` to true
   */
  const toggleCommitAcct = useCallback(() => {
    setElajsAcct({
      ...elajsAcct,

      dataCommitted: !elajsAcct.dataCommitted
    })
  }, [elajsAcct])

  /*
   ****************************************************************************************************************
   * Right Panel - Fortmatic
   ****************************************************************************************************************
   */

  /**
   * Check if Fortmatic is already connected, if so we just get the ethAddress,
   * this only needs to run once, we must always set it to '' or an ethAddress
   * because we have a third initial state of === false, which shows the loader
   */
  useEffect(() => {

    (async () => {

      let ethAddress = ''

      await (async () => {

        if (!ethConfig || !ethConfig.fm){
          return
        }

        const isFortmaticLoggedIn = await ethConfig.fm.user.isLoggedIn()
        if (!isFortmaticLoggedIn){
          return
        }

        const ethAccounts = await ethConfig.fmWeb3.eth.getAccounts()

        if (ethAccounts.length === 0){
          return
        }

        ethAddress = ethAccounts[0]
      })()

      setEthAddress(ethAddress)

    })()

  }, [])

  const fortmaticConnect = useCallback(async () => {

    const ethAddress = await ethConfig.fmWeb3.currentProvider.baseProvider.enable()

    setEthAddress(ethAddress[0])

  }, [ethConfig])

  // Once Fortmatic is connected and the account is ready we set canRegister to true
  useEffect(() => {

    if (!ethAddress.length || !elajsAcct.dataCommitted){
      return
    }

    setCanLogin(true)

  }, [ethAddress, elajsAcct.dataCommitted])

  /*
   ****************************************************************************************************************
   * Error Modal Handler
   ****************************************************************************************************************
   */
  const [modalErrorData, setModalErrorData] = useState({
    isOpen: false,
    msgs: []
  })

  const modalErrorToggle = () => setModalErrorData({ ...modalErrorData, isOpen: false} )

  /*
   ****************************************************************************************************************
   * Login & Smart Contract Calls
   ****************************************************************************************************************
   */
  // const [elajsStore, setElajsStore] = useState()

  /*
  useEffect(() => {

    const instance = new ozWeb3.lib.eth.Contract(ELAJStoreDev.abi, contracts[network].elajsStore)

    setElajsStore(instance)
  }, [])
   */

  const handleLogin = useCallback(() => {

    if (!ethAddress || !elajsAcct.username || !elajsAcct.password){
      return
    }

    (async () => {

      setLoading(true)

      // get the authHash from the id and check if it matches the authHash
      const id = keccak256(elajsAcct.username + ethAddress)
      // const idKey = elajs.keccak256(id.substring(2))

      // console.log('id = ' + id)

      const expectedAuthHash = keccak256(id.substring(2) + elajsAcct.password + ethAddress.substring(2) + 'elajs')

      // const authHash = await elajs._getVal(fieldIdTableKey).call()
      const authHash = await elajs._getVal(constants.SCHEMA.USER_TABLE, id, 'authHash')

      try {
        if (Web3.utils.hexToNumber(authHash) === 0){
          setModalErrorData({ msgs: ['No login found for entered credentials'], isOpen: true })
          toggleCommitAcct()
          setLoading(false)
          return
        }
      } catch (err){
        // pass
      }

      if (authHash !== expectedAuthHash){
        setModalErrorData({ msgs: ['No login found for entered credentials'], isOpen: true })
        toggleCommitAcct()
        setLoading(false)
        return
      }

      // check for admin
      let isAdmin = 0

      try {
        isAdmin = Web3.utils.hexToNumber(await elajs._getVal(constants.SCHEMA.USER_TABLE, id, 'admin'))
      } catch (err){
        // pass
      }

      props.dispatch({
        type: ProfileActionTypes.SET_CREDENTIALS,
        username: elajsAcct.username,
        userId: id,
        ethAddress: ethAddress,
        isAdmin: isAdmin
      })

      // else it matches
      window.location.hash = 'dashboard'
    })()

  }, [elajsAcct, ethAddress])

  const keyUpPw = useCallback((ev) => {
    if (ev.keyCode === 13){
      // enter key
      handleSaveAcct()
    }
  }, [handleSaveAcct])

  /*
  const { accounts, lib } = ethConfig.ozWeb3
  const ozWeb3Context = ethConfig.ozWeb3

  // load Counter Instance
  const [counterInstance, setCounterInstance] = useState(undefined)

  if (
    !counterInstance &&
    ozWeb3Context &&
    ozWeb3Context.networkId
  ) {
    const deployedNetwork = counterELAJSON.networks[ozWeb3Context.networkId.toString()]

    if (deployedNetwork){
      const instance = new ozWeb3Context.lib.eth.Contract(counterELAJSON.abi, deployedNetwork.address)
      setCounterInstance(instance)
    }
  }

  const [count, setCount] = useState(0)

  // memoize so that getCount only changes if
  const getCount = useCallback(async () => {
    if (counterInstance) {
      // Get the value from the contract to prove it worked.
      const response = await counterInstance.methods.value().call()
      // Update state with the result.
      setCount(response)
    }
  }, [counterInstance])

  useEffect(() => {
    getCount()
  }, [counterInstance, getCount])

  const increase = async () => {
    await counterInstance.methods.increase().send({ from: accounts[0], gasPrice: '10200000000' })
    getCount()
  }
  */

  return (
    <div className="app flex-row align-items-center">
      <Container className="mt-n5">
        <Row className="justify-content-center">
          <Col md="8">
            <div className="mb-3">
              <Link to="/">
                <button className="btn btn-tertiary btn-lg">
                  <i className="fa fa-arrow-left fa-lg mr-2"></i>
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-elastos btn-pill active btn-lg" style={{float: 'right'}}>
                  {/* <i className="fa fa-arrow-circle-right fa-lg mr-2"></i> */}
                  Sign Up
                </button>
              </Link>
            </div>
            <CardGroup style={{clear: 'both'}}>
              <Card className={'flip-card ' + (elajsAcct.dataCommitted ? 'flip-card-active' : '')}>
                <div className="flip-card-inner">
                  <CardBody className="flip-card-front px-4 py-5">
                    <h2>ElastosJS Auth</h2>
                    <p className="text-muted">
                      This is your ElastosJS account
                      {/* <i className="fa fa-question-circle fa-lg ml-1"></i> */}
                    </p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" onChange={handleUsernameChange} invalid={elajsAcct.usernameInvalid}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="current-password" onChange={handlePw} onKeyUp={keyUpPw}/>
                    </InputGroup>
                    <Row>
                      <Col xs="8" className="mb-5">
                        <Button color="primary" className="px-4 mt-2" onClick={handleSaveAcct}>Submit Login</Button>
                      </Col>
                      {/*
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                      */}
                    </Row>
                  </CardBody>
                  <CardBody className="flip-card-back p-4">
                    <h4 className="mt-5">
                      ElastosJS Account<br/>
                    </h4>

                    <p className="text-left p-4 mt-2">
                      <b>Welcome:</b> {elajsAcct.username}
                      <br/>
                      <br/>
                    </p>

                    <Row className="mt-3">
                      <Col>
                        <button className="btn btn-elastos px-4 mt-5" onClick={toggleCommitAcct}>Edit Details</button>
                      </Col>
                    </Row>
                  </CardBody>
                </div>
              </Card>
              <Card className="bg-tertiary p-4" style={{ width: '44%' }}>
                <CardBody>
                  <div>
                    <h2>Connect</h2>

                    <img src={FortmaticLogo}/>

                    <p className="text-muted py-4">
                      You should have setup your Fortmatic when you first signed up.
                    </p>
                    {ethAddress === false ? <Loading size="50" margin="1"/> : (ethAddress ?
                      <FortmaticBtn className="px-4" tabIndex={-1} disabled>
                        <div>Fortmatic Connected</div>
                        <i className="cui-circle-check icons font-2xl ml-2"></i>
                      </FortmaticBtn> :
                      <FortmaticBtn className="px-4" tabIndex={-1} onClick={fortmaticConnect}>
                        Connect Fortmatic
                      </FortmaticBtn>)
                    }
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
            <Card className="text-right">
              <CardBody>
                <button className="btn btn-primary" onClick={handleLogin} disabled={canLogin ? '' : 'disabled'}>
                  Continue
                  <i className="fa fa-sign-in fa-lg ml-1"></i>
                </button>
                {canLogin ?
                  <p>Click here to Login</p> :
                  <p className="text-muted">You must authenticate and connect Fortmatic to Continue</p>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/*
      ************************************************************************************************
      Modal Errors
      ************************************************************************************************
      */}
      <Modal isOpen={modalErrorData.isOpen} toggle={modalErrorToggle} style={{marginTop: '20%'}}>
        <ModalHeader>
          Please correct the following errors
        </ModalHeader>
        <ModalBody>
          <ul>
            {_.map(modalErrorData.msgs, (msg) => <ErrorMsg key={msg}>
              {msg}
            </ErrorMsg>)}
          </ul>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-elastos btn-block" onClick={modalErrorToggle}>Close</button>
        </ModalFooter>
      </Modal>
      {loading ? <LoadingOverlay/> : ''}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(Login)

const FortmaticBtn = styled(Button)`
  background-color: #6851ff;
  color: white;
  
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #8469ff;
    color: white;
  }
`

const ErrorMsg = styled.li`
  margin-top: 8px;
  margin-left: 16px;
`

function noop(){

}

// use accept a-zA-Z0-9_ and don't allow anything to start with an underscore (no spaces)
function validateUsername(username){
  return (/^[^_][\w]+$/.test(username))
}

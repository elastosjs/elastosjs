import React, { useContext, useState, useEffect, useCallback } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Progress,
  CardGroup,
} from 'reactstrap';
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import FortmaticLogo from '../../../assets/img/fortmatic_logo.svg'
import styled from 'styled-components'

import { colors } from '../../../config'

import { EthContext } from '../../../context/EthContext'

import RegisterForm from './RegisterForm'
import RegisterTransaction from './RegisterTransaction'
import Loading, { LoadingOverlay } from '../Loading'

import constants from '../../../constants'

import { ProfileActionTypes, ActionRegister } from '../../../store/redux/profile'

const Register = (props) => {

  const [ethConfig, ] = useContext(EthContext)

  const [canRegister, setCanRegister] = useState(false)

  const [progress, setProgress] = useState({
    val: 10,
    msg: 'Step 1'
  })

  const [elajsAcct, setElajsAcct] = useState({
    username: '',
    usernameInvalid: false,

    password: '',
    passwordConfirmInvalid: false,
    passwordInvalid: false,
    passwordInvalidMsg: '',

    dataCommitted: false,
  })

  const [ethAddress, setEthAddress] = useState(false)

  const [isRegistering, setIsRegistering] = useState(false)


  useEffect(() => {

    if (elajsAcct.dataCommitted){
      setProgress({...progress, val: progress.val += 45})
    } else if (progress.val >= 55){
      setProgress({...progress, val: progress.val -= 45})
    }

  }, [elajsAcct.dataCommitted])

  useEffect(() => {
    switch (progress.val){
      case 10:
        setProgress({...progress, msg: 'Step 1'})
        break
      case 55:
        setProgress({...progress, msg: 'Step 2'})
        break
      case 100:
        setProgress({...progress, msg: 'Step 3'})
        break
    }
  }, [progress.val])

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

      if (ethAddress){
        setProgress({...progress, val: progress.val += 45})
      }
    })()

  }, [])

  /**
   * Connect Fortmatic
   */
  const fortmaticConnect = useCallback(async () => {

    const ethAddress = await ethConfig.fmWeb3.currentProvider.baseProvider.enable()

    setEthAddress(ethAddress[0])

    setProgress({...progress, val: progress.val += 45})
  }, [])

  // Once Fortmatic is connected and the account is ready we set canRegister to true
  useEffect(() => {

    if (!ethAddress.length || !elajsAcct.dataCommitted){
      return
    }

    // TODO: better final validity checks
    if (
      elajsAcct.username.length < constants.PROFILE.USERNAME_MIN_LEN ||
      elajsAcct.password.length < constants.PROFILE.PASSWORD_MIN_LEN
    ){
      return
    }

    setCanRegister(true)

  }, [ethAddress, elajsAcct.dataCommitted])

  /**
   ************************************************************************************************************
   * Register Call
   *
   * We show a new page which requires the user to confirm a set of acknowledgements
   *
   * This only saves the data to redux, this function cannot be called until canRegister is true,
   * at which point we know that username, ethAddress are good, and password is on elajsAcct
   * RegisterTransaction handles the actual process
   ************************************************************************************************************
   */
  const handleRegister = useCallback(async () => {
    setIsRegistering(true)
  }, [])


  // waiting for registration,
  // once we have both the username and ethPassword
  /*
  useEffect(() => {

    if (!isRegistering){
      return
    }

    if (props.profile.username.length && props.profile.ethAddress.length){
      // window.location.hash = 'dashboard'
    }

  }, [isRegistering, props.profile])
  */

  return (
    <div className="app flex-row align-items-center">
      {/*
      ************************************************************************************************
      Registration Container - the username/password form is in component `RegisterForm`
      ************************************************************************************************
      */}
      {!isRegistering ?
        <Container className="mt-n5">
          <Row className="justify-content-center">
            <Col md="8">
              <div className="mb-3">
                <Link to="/login">
                  <button className="btn btn-tertiary btn-lg">
                    <i className="fa fa-arrow-left fa-lg mr-2"></i>
                  </button>
                </Link>
              </div>
              <RegisterHeader>
                <h3>
                  Welcome to elajs and <u>The Modern Internet</u>
                </h3>
                <p>
                  To safeguard your data and funds we use Fortmatic to protect
                  your encryption keys and funds.
                </p>
                <p>
                  You will need to also create an elajs account.
                </p>
                <Progress value={progress.val}>
                  {progress.msg}
                </Progress>
              </RegisterHeader>
              <CardGroup style={{ clear: 'both' }}>
                {/*
                ******************************************************************************************************************
                ElastosJS Acct
                ******************************************************************************************************************
                */}
                <Card className={'flip-card ' + (elajsAcct.dataCommitted ? 'flip-card-active' : '')}
                      style={{ borderTopLeftRadius: 0 }}>
                  <RegisterForm setElajsAcct={setElajsAcct} elajsAcct={elajsAcct}/>
                </Card>
                {/*
                ******************************************************************************************************************
                Fortmatic Connect
                ******************************************************************************************************************
                */}
                <Card className="bg-tertiary px-4" style={{ width: '44%', borderTopRightRadius: 0 }}>
                  <CardBody>
                    <div>
                      <h2>Connect</h2>

                      <img src={FortmaticLogo}/>

                      <p className="text-muted py-4" style={{ marginBottom: '40px' }}>
                        Your encryption keys and wallet is managed by Fortmatic, learn more at{' '}
                        <a href="https://fortmatic.com" target="_blank">
                          https://fortmatic.com
                        </a>
                      </p>

                      {ethAddress === false ? <Loading size="50"/> : (ethAddress ?
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
                  <button className="btn btn-primary mb-2" onClick={handleRegister}
                          disabled={canRegister ? '' : 'disabled'}>
                    Continue
                    <i className="fa fa-sign-in fa-lg ml-1"></i>
                  </button>
                  {canRegister ?
                    <p>Click here to Register</p> :
                    <p className="text-muted">You must register an elajs account and connect Fortmatic to Continue</p>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container> :

        <RegisterTransaction elajsAcct={elajsAcct} ethAddress={ethAddress}/>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(Register)


const FortmaticBtn = styled(Button)`
  background-color: #6851ff;
  color: white;
  
  display: flex;
  align-items: center;
  
  margin-top: 88px;

  &:hover {
    background-color: #8469ff;
    color: white;
  }
`

const RegisterHeader = styled(CardHeader)`
  color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: ${colors.secondary_color};
`

function noop(){

}



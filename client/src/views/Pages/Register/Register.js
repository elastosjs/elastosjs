import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Progress,
  CardGroup,
  Modal, ModalBody, ModalFooter, ModalHeader,
  Popover, PopoverHeader, PopoverBody
} from 'reactstrap';
import { Link } from 'react-router-dom'
import FortmaticLogo from '../../../assets/img/fortmatic_logo.svg'
import styled from 'styled-components'
import _ from 'lodash'

import { colors } from '../../../config'

import { EthContext } from '../../../context/EthContext'

const Register = () => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [canRegister, setCanRegister] = useState(false)

  const [pollFortmatic, setPollFortmatic] = useState()

  const [progress, setProgress] = useState({
    val: 10,
    msg: 'Step 1'
  })

  const [elajsAcct, setElajsAcct] = useState({
    email: '',
    emailInvalid: false,

    password: '',
    passwordConfirmInvalid: false,
    passwordInvalid: false,
    passwordInvalidMsg: '',

    dataCommitted: false,
  })

  const [ethAddress, setEthAddress] = useState('')

  const [modalErrorData, setModalErrorData] = useState({
    isOpen: false,
    msgs: []
  })

  const handleEmailChange = (ev) => {
    const email = ev.target.value

    setElajsAcct({ ...elajsAcct, email: email, emailInvalid: !(email && email.length > 5 && validateEmail(email))} )
  }

  const handlePw = async (ev) => {
    const pw = ev.target.value

    if (pw.length < 8){
      setElajsAcct({ ...elajsAcct, passwordInvalid: true, passwordInvalidMsg: ''} )
      return
    }

    if (/[ ]/.test(pw)){
      setElajsAcct({ ...elajsAcct, passwordInvalid: true, passwordInvalidMsg: 'No spaces allowed'} )
      return
    }

    if (!(/\d/.test(pw))){
      setElajsAcct({ ...elajsAcct, passwordInvalid: true, passwordInvalidMsg: 'Must include at least 1 number'} )
      return
    }

    // else set to valid
    setElajsAcct({ ...elajsAcct, password: pw, passwordInvalid: false, passwordInvalidMsg: ''} )

  }

  // if the password changes it definitely invalidates the passwordConfirm being valid
  useEffect(() => {
    if (!elajsAcct.passwordConfirmInvalid){
      handlePwConfirm('')
    }
  }, [elajsAcct.password])

  const handlePwConfirm = (pwConfirm) => {

    if (elajsAcct.password.length < 8){
      return
    }

    if (elajsAcct.password !== pwConfirm){
      setElajsAcct({ ...elajsAcct, passwordConfirmInvalid: true} )
      return
    }

    // else set to valid
    setElajsAcct({ ...elajsAcct, passwordConfirmInvalid: false} )
  }

  const handleCreateAcct = () => {

    let errors = []

    if (elajsAcct.email.length < 6 || elajsAcct.emailInvalid){
      errors.push('Email is invalid')
    }

    if (elajsAcct.password.length < 8){
      errors.push('Password must be 8 chars or more')
    } else if (elajsAcct.passwordInvalid){
      errors.push(`Password is invalid - ${elajsAcct.passwordInvalidMsg}`)
    } else if (elajsAcct.passwordConfirmInvalid){
      errors.push('Your passwords do not match')
    }

    // if at this point
    if (errors.length){
      setModalErrorData({ msgs: errors, isOpen: true })
      return
    }

    // if we reach here all is good with the registration fields
    toggleCommitAcct()
  }

  /**
   * We commit the registration fields by setting `elajsAcct.dataCommitted` to true
   */
  const toggleCommitAcct = () => {
    setElajsAcct({
      ...elajsAcct,

      dataCommitted: !elajsAcct.dataCommitted
    })
  }

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

  const modalErrorToggle = () => setModalErrorData({ ...modalErrorData, isOpen: false} )

  /**
   * Check if Fortmatic is connected
   */
  useEffect(async () => {

    if (ethConfig){
      const isFortmaticLoggedIn = await ethConfig.fm.user.isLoggedIn()

      debugger
    }

  }, [])

  /**
   * Connect Fortmatic
   */
  const fortmaticConnect = async () => {

    const ethAddress = await ethConfig.fmWeb3.currentProvider.enable()

    setEthAddress(ethAddress)

    debugger

  }

  return (
    <div className="app flex-row align-items-center">
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
                Welcome to ElastosJS and the Modern Internet
              </h3>
              <p>
                To safeguard your data and funds we use Fortmatic to protect
                your encryption keys and funds.
              </p>
              <p>
                You will need to also create an ElastosJS account.
              </p>

              <Progress value={progress.val}>
                {progress.msg}
              </Progress>
            </RegisterHeader>
            <CardGroup style={{clear: 'both'}}>
              <Card className={'flip-card ' + (elajsAcct.dataCommitted ? 'flip-card-active' : '')} style={{borderTopLeftRadius: 0}}>
                <div className="flip-card-inner">
                  <CardBody className="flip-card-front p-4">
                    <h2>ElastosJS Auth</h2>
                    <p className="text-muted">
                      This is your ElastosJS account
                      <i className="fa fa-question-circle fa-lg ml-1"></i>
                    </p>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-envelope"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" placeholder="Email" autoComplete="email" onChange={handleEmailChange} invalid={elajsAcct.emailInvalid}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input id="pwInput" type="password" placeholder="Password (8 chars+, 1+ number)" autoComplete="password" onChange={handlePw} invalid={elajsAcct.passwordInvalid}/>
                      <Popover placement="bottom" isOpen={elajsAcct.passwordInvalidMsg.length} target="pwInput">
                        <PopoverHeader>Password Error</PopoverHeader>
                        <PopoverBody>{elajsAcct.passwordInvalidMsg}</PopoverBody>
                      </Popover>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input id="pwConfirmInput" type="password" placeholder="Confirm Password" onChange={(ev) => handlePwConfirm(ev.target.value)} invalid={elajsAcct.passwordConfirmInvalid} autoComplete="confirm password" />
                      <Popover placement="bottom" isOpen={elajsAcct.passwordConfirmInvalid} target="pwConfirmInput">
                        <PopoverBody>Passwords do not match</PopoverBody>
                      </Popover>
                    </InputGroup>
                    <Row>
                      <Col>
                        <Button color="primary" className="px-4 mt-2" onClick={handleCreateAcct}>Create ElastosJS Account</Button>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardBody className="flip-card-back p-4">
                    <h4 className="mt-5">
                      ElastosJS Account<br/>
                      Created
                    </h4>

                    <p className="text-left p-4 mt-2">
                      <b>Your Email:</b> {elajsAcct.email}
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
              <Card className="bg-tertiary p-4" style={{ width: '44%', borderTopRightRadius: 0 }}>
                <CardBody>
                  <div>
                    <h2>Connect</h2>

                    <img src={FortmaticLogo}/>

                    <p className="text-muted py-4">
                      Your encryption keys and wallet is managed by Fortmatic, learn more at <a href="https://fortmatic.com" target="_blank">
                        https://fortmatic.com
                      </a>
                    </p>
                    <FortmaticBtn className="px-4 mt-5" tabIndex={-1} onClick={fortmaticConnect}>
                      Connect Fortmatic
                    </FortmaticBtn>
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
            <Card className="text-right">
              <CardBody>
                <button className="btn btn-primary mb-2" onClick={() => window.location.hash='dashboard'} disabled={canRegister ? '' : 'disabled'}>
                  Continue
                  <i className="fa fa-sign-in fa-lg ml-1"></i>
                </button>
                <p className="text-muted">You must register an ElastosJS account and connect Fortmatic to Continue</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* lib && counterInstance */}
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
    </div>
  )
}

export default Register;


const FortmaticBtn = styled(Button)`
  background-color: #6851ff;
  color: white;

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

const ErrorMsg = styled.li`
  margin-top: 8px;
  margin-left: 16px;
`


function noop(){

}

function validateEmail(email){
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
}

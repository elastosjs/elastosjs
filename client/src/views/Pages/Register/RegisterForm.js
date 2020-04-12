import React, { useState, useEffect, useCallback } from 'react'

import {
  Button,
  CardBody, Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader,
  Popover,
  PopoverBody,
  PopoverHeader, Row
} from 'reactstrap'
import _ from 'lodash'
import styled from 'styled-components'

import constants from '../../../constants'

/**
 * This only handles the username, password, once those are committed to
 * the elajsAcct state on the parent Register page we're done and
 * dataCommitted = true
 */
const RegisterForm = (props) => {

  const {elajsAcct, setElajsAcct} = props

  const [modalErrorData, setModalErrorData] = useState({
    isOpen: false,
    msgs: []
  })

  const handleUsernameChange = useCallback((ev) => {
    const username = ev.target.value

    setElajsAcct({ ...elajsAcct, username, usernameInvalid: !(username && username.length >= constants.PROFILE.USERNAME_MIN_LEN && validateUsername(username))} )
  }, [elajsAcct])

  const handlePw = useCallback((ev) => {
    const pw = ev.target.value

    if (pw.length < 8){
      setElajsAcct({ ...elajsAcct, passwordInvalid: true, passwordInvalidMsg: ''} )
      return
    }

    if (pw.length > 32){
      setElajsAcct({ ...elajsAcct, passwordInvalid: true, passwordInvalidMsg: 'Password too long'} )
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

  }, [elajsAcct])

  // if the password changes it definitely invalidates the passwordConfirm being valid
  useEffect(() => {
    if (!elajsAcct.passwordConfirmInvalid){
      handlePwConfirm('')
    }
  }, [elajsAcct.password])

  const handlePwConfirm = useCallback((pwConfirm) => {

    if (elajsAcct.password.length < 8){
      return
    }

    if (elajsAcct.password !== pwConfirm){
      setElajsAcct({ ...elajsAcct, passwordConfirmInvalid: true} )
      return
    }

    // else set to valid
    setElajsAcct({ ...elajsAcct, passwordConfirmInvalid: false} )
  }, [elajsAcct])

  const handleCreateAcct = useCallback(() => {

    let errors = []

    if (elajsAcct.username.length < 6 || elajsAcct.usernameInvalid){
      errors.push('Username is invalid')
    }

    if (elajsAcct.password.length < 8){
      errors.push('Password must be 8 chars or more')
    } else if (elajsAcct.password.length > 32){
      errors.push('Password cannot be over 32 characters')
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
  }, [elajsAcct])

  /**
   * We commit the registration fields by setting `elajsAcct.dataCommitted` to true
   */
  const toggleCommitAcct = useCallback(() => {
    setElajsAcct({
      ...elajsAcct,

      dataCommitted: !elajsAcct.dataCommitted
    })
  }, [elajsAcct])

  const modalErrorToggle = () => setModalErrorData({ ...modalErrorData, isOpen: false} )

  return (
    <div className="flip-card-inner">
      {/*
      ************************************************************************************************
      Username Password Container Only
      ************************************************************************************************
      */}
      <CardBody className="flip-card-front p-4">
        <h2>ElastosJS Auth</h2>
        <p className="text-muted">
          This is your ElastosJS account
          {/* <i className="fa fa-question-circle fa-lg ml-1"/> */}
        </p>
        <InputGroup className="mb-4">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="icon-user"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="text" placeholder="Username" autoComplete="username" onChange={handleUsernameChange} invalid={elajsAcct.usernameInvalid}/>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="icon-lock"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input id="pwInput" type="password" placeholder="Password (8 chars+, 1+ number)" autoComplete="password" onChange={handlePw} invalid={elajsAcct.passwordInvalid}/>
          <Popover placement="bottom" isOpen={!!(elajsAcct.passwordInvalidMsg && elajsAcct.passwordInvalidMsg.length)} target="pwInput">
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
          <b>Your Username:</b> {elajsAcct.username}
          <br/>
          <br/>
        </p>

        <Row className="mt-3">
          <Col>
            <button className="btn btn-elastos px-4 mt-5" onClick={toggleCommitAcct}>Edit Details</button>
          </Col>
        </Row>
      </CardBody>

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
    </div>
  )
}

export default RegisterForm

const ErrorMsg = styled.li`
  margin-top: 8px;
  margin-left: 16px;
`

function validateUsername(username){
  return (/^[^_][\w]+$/.test(username))
}

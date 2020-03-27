import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap'

import styled from 'styled-components'

import { EthContext } from '../../../context/EthContext'

// import counterJSON from '../../../contracts/Counter.json'

import FortmaticLogo from '../../../assets/img/fortmatic_logo.svg'

const Login = () => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [canLogin, setCanLogin] = useState(false)

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
    const deployedNetwork = counterJSON.networks[ozWeb3Context.networkId.toString()]

    if (deployedNetwork){
      const instance = new ozWeb3Context.lib.eth.Contract(counterJSON.abi, deployedNetwork.address)
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
    await counterInstance.methods.increase().send({ from: accounts[0] })
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
              <button className="btn btn-primary btn-pill active btn-lg" style={{float: 'right'}}>
                <i className="fa fa-arrow-circle-right fa-lg mr-2"></i>
                Sign Up
              </button>
            </div>
            <CardGroup style={{clear: 'both'}}>
              <Card className="p-4">
                <CardBody>
                  <Form>
                    <h2>ElastosJS Auth</h2>
                    <p className="text-muted">
                      This is your ElastosJS account
                      <i className="fa fa-question-circle fa-lg ml-1"></i>
                    </p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="current-password" />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4 mt-2" onClick={() => noop()}>Authenticate</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
              <Card className="bg-tertiary p-4" style={{ width: '44%' }}>
                <CardBody>
                  <div>
                    <h2>Connect</h2>

                    <img src={FortmaticLogo}/>

                    <p className="text-muted py-4">
                      You should have setup your Fortmatic when you first signed up.
                    </p>
                    <FortmaticBtn className="px-4 mt-2" tabIndex={-1} onClick={() => ethConfig.fmWeb3.currentProvider.enable()}>
                      Connect Fortmatic
                    </FortmaticBtn>
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
            <Card className="text-right">
              <CardBody>
                <button className="btn btn-primary" onClick={() => window.location.hash='dashboard'}>{/* disabled={canLogin ? '' : 'disabled'}>*/}
                  Continue
                  <i className="fa fa-sign-in fa-lg ml-1"></i>
                </button>
                <p className="text-muted">You must authenticate and connect Fortmatic to Continue</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* lib && counterInstance */}
    </div>
  )
}

export default Login

const FortmaticBtn = styled(Button)`
  background-color: #6851ff;
  color: white;

  &:hover {
    background-color: #8469ff;
    color: white;
  }
`


function noop(){

}

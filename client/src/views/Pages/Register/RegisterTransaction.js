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

import { EthContext } from '../../../context/EthContext'
import _ from 'lodash'

import Web3 from 'web3'

import { namehash, keccak256 } from 'ela-js'

import constants from '../../../constants'

import Loading from '../Loading'

import elastosJSLogo from '../../../assets/img/elastosJS.svg'

import { ProfileActionTypes } from '../../../store/redux/profile'

import ELAJStoreDev from '../../../contracts/ELAJSStore-development.json'
// import ELAJStoreTestnet from '../../../contracts/ELAJSStore-development.json'

// import counterELAJSON from '../../../contracts/CounterELA.json'

const USER_TABLE = constants.SCHEMA.USER_TABLE

const RegisterTransaction = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [agree, setAgree] = useState(false)

  const [registerPending, setRegisterPending] = useState(false)
  const [registerDone, setRegisterDone] = useState(false)
  const [transactions, setTransactions] = useState({})

  const elajs = ethConfig.elajs

  const {elajsAcct, ethAddress} = props

  const handleAgree = useCallback((ev) => {

    setAgree(!!ev.target.checked)

  }, [setAgree])

  const register = useCallback(async () => {

    if (!agree || !elajsAcct || !ethAddress){
      return
    }

    setRegisterPending(true)

    try {

      // we avoid username collision checking by declaring the unique key as username + ethAddress,
      // so technically multiple people could have the same username
      // TODO: revisit this decision
      const id = keccak256(elajsAcct.username + ethAddress)

      const cols = ['ethAddressHash', 'authHash', 'admin']
      const values = [
        keccak256(ethAddress),
        keccak256(id.substring(2) + elajsAcct.password + ethAddress.substring(2) + 'elajs'),
        Web3.utils.numberToHex(0)
      ]

      // await elajs.insertRow(USER_TABLE, cols, values, {id: id})
      let curTransactions = {}

      for (let i = 0; i < cols.length; i++){
        let insertPromise = elajs.insertVal(USER_TABLE, cols[i], values[i], {id: id})

        curTransactions[i] = {
          promise: insertPromise
        }

        ;(function(key){
          insertPromise.on('transactionHash', (hash) => {
            curTransactions[key] = {
              ...curTransactions[key],
              hash: hash
            }
            setTransactions(Object.assign({}, curTransactions))
          })

          insertPromise.on('receipt', (hash) => {
            curTransactions[key] = {
              ...curTransactions[key],
              done: true
            }
            setTransactions(Object.assign({}, curTransactions))
          })
        })(i)

        setTransactions(Object.assign({}, curTransactions))
        await insertPromise
      }

      props.dispatch({
        type: ProfileActionTypes.REGISTER,
        username: props.elajsAcct.username,
        ethAddress: props.ethAddress
      })

      setRegisterDone(true)

    } catch (err){
      // TODO: error modal
      // TODO: rollbar error reporting
      console.error(err)
    }

  }, [agree, elajs, elajsAcct, ethAddress])

  /*
  useEffect(() => {
    debugger
  }, [transactions])
  */

  /*
 ****************************************************************************************************************
 * Registration Transactions TODO
 ****************************************************************************************************************
 */

  /*
  // AUTH SIGNED
  // load Counter Instance
  const [counterInstance, setCounterInstance] = useState(undefined)



  useEffect(() => {

    const instance = new fmWeb3.eth.Contract(counterELAJSON.abi, contracts[network].counterEla)
    // const instance = new ozWeb3.lib.eth.Contract(counterELAJSON.abi, contracts[network].counterEla)

    setCounterInstance(instance)
  }, [])

  useEffect(() => {
    getCount()
  }, [counterInstance, getCount])

  // memoize so that getCount function only changes if the instance changes
  const getCount = useCallback(async () => {
    if (counterInstance) {
      // Get the value from the contract to prove it worked.
      const response = await counterInstance.methods.value().call()
      // Update state with the result.
      setCount(response)
    }
  }, [counterInstance])

  const increase = async () => {

    const accounts = await fmWeb3.eth.getAccounts()

    console.log('Fortmatic address: ' + accounts[0])

    await counterInstance.methods.increase().send({
      // from: ozWeb3.accounts[0],
      // from: web3.givenProvider.selectedAddress,
      from: accounts[0],
      gasPrice: '10000000000'
    })
    getCount()
  }
  */

  /*
  // UNAUTH SIGNED
  let elajsStoreJSON

  switch (network){
    case constants.NETWORK.LOCAL:
      elajsStoreJSON = ELAJStoreDevelopment
      break
  }

  // load ELAJSStore Instance
  const [elajsStoreInstance, setElajsStoreInstance] = useState()

  const gsnProvider = ethConfig.gsnProvider


  const { accounts, lib } = ethConfig.web3

  debugger
  */
  /*
  if (
    !elajsStoreInstance &&
    gsnProvider &&
    gsnProvider.networkId
  ) {
    const deployedNetwork = elajsStoreJSON.networks[web3Context.networkId.toString()]

    if (deployedNetwork){
      const instance = new web3Context.web3.relayClient.web3.eth.Contract(elajsStoreJSON.abi, contracts[network].elajs_store)
      setElajsStoreInstance(instance)
    }
  }
  */



  return <Container>

    <img src={elastosJSLogo} className="mb-2 ml-4"/>

    <Card>
      <CardBody>

        {!registerPending ? <div>
          {/*
          ****************************************************************************************************
          *
          ****************************************************************************************************
          */}
          <Row>
            <Col className="mb-3">
              <h4>
                Terms and Acknowledgements
              </h4>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="text-white bg-danger">
                <CardBody>
                  <h3>
                    <ol>
                      <li>
                        Data stored on our Smart Contracts is <b>Public!</b> Any data you wish to keep private must be
                        encrypted by you.
                        ElastosJS accepts <u>no responsibility</u> for data issues arising from any applications you created.
                      </li>
                    </ol>
                  </h3>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="text-white bg-primary">
                <CardBody>
                  <h3>
                    <ol start="2">
                      <li>
                        ElastosJS stores no data, uses any cookies or tracking in the spirit of decentralization.
                      </li>
                    </ol>
                  </h3>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className="pull-right align-items-center" style={{ display: 'flex', 'flexDirection': 'row' }}>
            <div className="mr-2" style={{ fontSize: '1.2em' }}>
              I agree with the above{' '}
            </div>
            <div className="mr-3">
              <input type="checkbox" style={{ zoom: 2 }} onChange={handleAgree}/>
            </div>
            <div>
              <button className="btn btn-lg btn-secondary" onClick={register}
                      disabled={!agree ? 'disabled' : ''}>Register
              </button>
            </div>
          </div>
        </div> : <div>
          {/*
          ****************************************************************************************************
          *
          ****************************************************************************************************
          */}
          <Row>
            <Col className="mb-3 animated fadeIn">
              <h4>
                Creating Your Account
              </h4>
              This uses Gas Station Network so you don't pay for gas or need a wallet yet
            </Col>
          </Row>

          {_.keys(transactions).map((key) => {

            let trans = transactions[key]

            let cardCssClass = 'bg-secondary'
            let msg = 'Sending Transaction'
            if (trans.done){
              cardCssClass = 'bg-success'
              msg = <div>
                Done Transaction:<br/>
                <a target="_blank" href={`https://testnet.elaeth.io/tx/${trans.hash}/internal_transactions`} className="text-white">{trans.hash}</a>
              </div>
            } else if (trans.hash) {
              cardCssClass = 'bg-primary'
              msg = <div>Running Transaction<br/>{trans.hash}</div>
            }

            return <Row className="animated fadeIn" key={parseInt(key) + 1}>
              <Col>
                <Card className={`text-white ${cardCssClass}`}>
                  <CardBody>
                    <h4>
                      <ol start={parseInt(key) + 1}>
                        <li>
                          {msg}
                        </li>
                      </ol>
                    </h4>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          })}

          {registerDone ?
          <Row>
            <Col>
              <button className="btn btn-primary btn-lg pull-right" onClick={() => window.location.hash = 'dashboard'}>Continue</button>
            </Col>
          </Row> : <div/>}
        </div>}
      </CardBody>
    </Card>
  </Container>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(RegisterTransaction)

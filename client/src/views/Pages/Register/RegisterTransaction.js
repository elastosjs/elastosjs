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
import { NetworkContext } from '../../../context/NetworkContext'

import Web3 from 'web3'

import { namehash, keccak256 } from 'ela-js'

import constants from '../../../constants'

import { contracts } from '../../../config'

import { ProfileActionTypes } from '../../../store/redux/profile'

import ELAJStoreDev from '../../../contracts/ELAJSStore-development.json'
// import ELAJStoreTestnet from '../../../contracts/ELAJSStore-development.json'

// import counterELAJSON from '../../../contracts/CounterELA.json'

const USER_TABLE = constants.SCHEMA.USER_TABLE

const RegisterTransaction = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const elajs = ethConfig.elajs

  const {elajsAcct, ethAddress} = props

  const register = useCallback(async () => {

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

      await elajs.insertRow(USER_TABLE, cols, values, {id: id})

      props.dispatch({
        type: ProfileActionTypes.REGISTER,
        username: props.elajsAcct.username,
        ethAddress: props.ethAddress
      })

      window.location.hash = 'dashboard'

    } catch (err){
      // TODO: error modal
      // TODO: rollbar error reporting
      console.error(err)
    }

  }, [elajs])

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
    Hello World
    <Button onClick={register}>I agree</Button>
  </Container>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(RegisterTransaction)

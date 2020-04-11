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

import constants from '../../../constants'

import { contracts } from '../../../config'

import { ProfileActionTypes, ActionRegister } from '../../../store/redux/profile'

import ELAJStoreDevelopment from '../../../contracts/ELAJSStore-development.json'
// import ELAJStoreTestnet from '../../../contracts/ELAJSStore-development.json'

import counterELAJSON from '../../../contracts/CounterELA.json'

const RegisterTransaction = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)
  const [network, setNetwork] = useContext(NetworkContext)

  const [count, setCount] = useState(0)

  const fmWeb3 = ethConfig.fmWeb3
  const ozWeb3 = ethConfig.ozWeb3

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

  /*
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
    Hello World {count}
    <Button onClick={increase}>Test</Button>
  </Container>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(RegisterTransaction)

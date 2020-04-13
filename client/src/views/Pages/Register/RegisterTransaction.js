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

import elajs from 'ela-js'

import constants from '../../../constants'

import { contracts } from '../../../config'

import { ProfileActionTypes } from '../../../store/redux/profile'

import ELAJStoreDev from '../../../contracts/ELAJSStore-development.json'
// import ELAJStoreTestnet from '../../../contracts/ELAJSStore-development.json'

// import counterELAJSON from '../../../contracts/CounterELA.json'

const USER_TABLE = constants.SCHEMA.USER_TABLE

const RegisterTransaction = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)
  const [network, setNetwork] = useContext(NetworkContext)

  // const fmWeb3 = ethConfig.fmWeb3
  const ozWeb3 = ethConfig.ozWeb3

  const {inserts} = getInsertData(props)

  const [elajsStore, setElajsStore] = useState()

  useEffect(() => {

    const instance = new ozWeb3.lib.eth.Contract(ELAJStoreDev.abi, contracts[network].elajsStore)

    setElajsStore(instance)
  }, [])

  const register = useCallback(async () => {

    try {
      for (let i = 0; i < inserts.length; i++){

        // ephemeral call - this contract was initialized off of ozWeb3
        await elajsStore.methods.insertVal(
          inserts[i].tableKey,
          inserts[i].idTableKey,
          inserts[i].fieldIdTableKey,
          inserts[i].idKey,
          inserts[i].fieldKey,
          inserts[i].id,
          inserts[i].value
        ).send({
          from: ozWeb3.accounts[0]
        })
      }

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

  }, [elajsStore])

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


function getInsertData({elajsAcct, ethAddress}){

  // we avoid username collision checking by declaring the unique key as username + ethAddress,
  // so technically multiple people could have the same username
  // TODO: revisit this decision
  const id = elajs.keccak256(elajsAcct.username + ethAddress)
  const idKey = elajs.keccak256(id.substring(2))

  const tableKey = elajs.namehash(USER_TABLE)
  const idTableKey = elajs.namehash(`${id.substring(2)}.${USER_TABLE}`)

  const cols = ['ethAddressHash', 'authHash', 'admin']
  const colTypes = ['BYTES32', 'BYTES32', 'BOOL']

  const inserts = [
    {
      tableKey,
      idTableKey,
      fieldIdTableKey: elajs.namehash(`ethAddressHash.${id.substring(2)}.${USER_TABLE}`),

      idKey,
      id,
      fieldKey: elajs.keccak256('ethAddressHash'),
      value: elajs.keccak256(ethAddress)
    },
    {
      tableKey,
      idTableKey,
      fieldIdTableKey: elajs.namehash(`authHash.${id.substring(2)}.${USER_TABLE}`),

      idKey,
      id,
      // no point hiding the salt here anyway, it's all client-side
      fieldKey: elajs.keccak256('authHash'),
      value: elajs.keccak256(id + elajsAcct.password + ethAddress + 'elajs')
    },
    {
      tableKey,
      idTableKey,
      fieldIdTableKey: elajs.namehash(`admin.${id.substring(2)}.${USER_TABLE}`),

      idKey,
      id,
      fieldKey: elajs.keccak256('admin'),
      value: Web3.utils.numberToHex(0)
    }
  ]

  return {
    cols,
    colTypes,
    inserts
  }
}


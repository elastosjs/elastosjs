import React, { useState, useCallback, useContext, useRef } from 'react'
import { useEthBalance } from '../hooks/useEthBalance'
import { connect } from 'react-redux'
import { Card, CardBody, Col, Row, Input, CardFooter } from 'reactstrap'
import { toastr } from 'react-redux-toastr'
import styled from 'styled-components'
import Web3 from 'web3'
import { EthContext } from '../context/EthContext'


const WithdrawFundsDb = (props) => {

  const { walletAddress } = useEthBalance()

  const [ethConfig, ] = useContext(EthContext)

  const elajsDbUser = ethConfig.elajsDbUser

  const inputAddAmt = useRef(null)

  const handleWithdrawAllFunds = async () => {

    if (props.gsnBalance <= 0){
      toastr.error('No balance to withdraw')
      return
    }

    if (!props.selectedDb || !props.selectedDb.contractAddress || !walletAddress){
      toastr.error('System Error - Missing contract address')
    }

    // only the owner can withdraw funds
    await elajsDbUser.defaultWeb3.currentProvider.baseProvider.enable()

    elajsDbUser.setDatabase(props.selectedDb.contractAddress)

    await elajsDbUser.withdrawAll(walletAddress)

    toastr.success('Funds withdrawn successfully')

    props.triggerEffect()

    props.closeModal()
  }

  const handleWithdrawFunds = async () => {

    toastr.info('Under Development')

    /*
    const amt = parseFloat(inputAddAmt.current.value)

    if (isNaN(amt) || amt <= 0){
      toastr.error('You need to specify an amount greater than 0')
      return
    }

    if (ethBalance <= 0){
      toastr.error('You have no ELATHSC in your main account')
      return
    }

    if (amt > 2){
      toastr.error('You cannot add more than 2 ELAETHSC at once')
      return
    }

    if (!walletAddress || !props.selectedDb || !props.selectedDb.contractAddress){
      toastr.error('System Error - Missing contract address')
      return
    }

    // we send the funds from our Fortmatic account which has funds
    await elajs.addFunds(walletAddress, props.selectedDb.contractAddress, amt.toString())

    toastr.success('Funds added successfully')

    props.triggerEffect()

    props.closeModal()
     */
  }

  return <div>
    <Row>
      <Col>
        <Card className="text-white bg-info">
          <CardBody>
            <h2>
              {props.gsnBalance ? Web3.utils.fromWei(props.gsnBalance.toString()) : 0}
            </h2>
            GSN Balance
          </CardBody>
          <CardFooter className="text-dark">
            <WithdrawContainer className="flex-row align-items-center">
              <div>
                <button className="pull-right btn btn-secondary" onClick={handleWithdrawAllFunds}>Withdraw All Funds</button>
              </div>
              <div className="text-center mx-3">
                OR
              </div>
              <div>
                <Input type="number" size="3" innerRef={inputAddAmt} placeholder="amount to withdraw"/>
              </div>
              <div>
                <button className="pull-right btn btn-secondary" onClick={handleWithdrawFunds}>Withdraw</button>
              </div>
            </WithdrawContainer>
          </CardFooter>
        </Card>
      </Col>
    </Row>

    <Row>
      <Col className="p-3 text-center">
        You will be prompted to sign and pay a negligible for the transfer transaction.
      </Col>
    </Row>

    <Row>
      <Col>
        <button className="btn btn-secondary pull-right mt-4" onClick={props.closeModal}>
          Cancel
        </button>
      </Col>
    </Row>
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(WithdrawFundsDb)

const WithdrawContainer = styled.div`
  display: flex;
  white-space: nowrap;
`

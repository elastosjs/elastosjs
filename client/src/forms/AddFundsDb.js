import React, { useState, useCallback, useContext, useRef } from 'react'
import { useEthBalance } from '../hooks/useEthBalance'
import { connect } from 'react-redux'
import { Card, CardBody, Col, Row, Input, CardFooter } from 'reactstrap'
import { toastr } from 'react-redux-toastr'
import Web3 from 'web3'
import { EthContext } from '../context/EthContext'

const AddFundsDb = (props) => {

  const { ethBalance, walletAddress } = useEthBalance()

  const [ethConfig, ] = useContext(EthContext)

  const elajsDb = ethConfig.elajsDb

  const inputAddAmt = useRef(null)

  const handleAddFunds = useCallback(async () => {

    const amt = parseFloat(inputAddAmt.current.value)

    if (isNaN(amt) || amt <= 0){
      toastr.error('You need to specify an amount greater than 0')
      return
    }

    if (ethBalance <= 0){
      toastr.error('You have no ELAETHSC in your main account')
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
    await elajsDb.addFunds(walletAddress, props.selectedDb.contractAddress, amt.toString())

    toastr.success('Funds added successfully')

    props.triggerEffect()

    props.closeModal()
  }, [ethBalance, walletAddress, props.selectedDb])

  return <div>
    <Row>
      <Col>
        <Card className="text-white bg-danger">
          <CardBody>
            <Row>
              <Col sm="5">
                <h3>
                  {ethBalance.toFixed(4)}
                </h3>

                Your ELAETHSC Balance
              </Col>
              <Col className="text-center" sm="2">
                <i className="fa fa-arrow-right fa-lg"/>
              </Col>
              <Col sm="5">
                <Input type="number" innerRef={inputAddAmt} placeholder="amount to add"/>
                <br/>
                <button className="pull-right btn btn-secondary" onClick={handleAddFunds}>Transfer Funds</button>
              </Col>
            </Row>

          </CardBody>
          <CardFooter className="text-dark">
            We recommend keeping your database funded with at <b>least 0.1 ETHSC</b> and no more than 2.<br/>
            <br/>
            Currently your database has {props.gsnBalance ? Web3.utils.fromWei(props.gsnBalance.toString()) : 0} ELAETHSC.
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

export default connect(mapStateToProps)(AddFundsDb)

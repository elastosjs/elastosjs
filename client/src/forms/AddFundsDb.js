import React, { useState, useCallback, useContext, useRef } from 'react'
import { useEthBalance } from '../hooks/useEthBalance'
import { connect } from 'react-redux'
import { Card, CardBody, Col, Row, Input, CardFooter } from 'reactstrap'



const AddFundsDb = (props) => {

  const { ethBalance, walletAddress } = useEthBalance()

  const inputAddAmt = useRef(null)

  const handleAddFunds = () => {

    const amt = inputAddAmt.current.value

    debugger

  }

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

                Your ELASC Balance
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
            We recommend keeping your database funded with at least 0.1 ETHSC.
            Currently your database has {props.gsnBalance} ELASC.
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

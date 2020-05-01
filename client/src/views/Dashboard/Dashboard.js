import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useEthBalance } from '../../hooks/useEthBalance'
import { useDatabase } from '../../hooks/useDatabase'
import { useEffectTrigger } from '../../hooks/useEffectTrigger'
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,

  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,

  Row,
  Table,
} from 'reactstrap'
import Loading from '../Pages/Loading'
import Web3 from 'web3'

import { connect } from 'react-redux'
import { ProfileActionTypes } from '../../store/redux/profile'

import CreateDb from '../../forms/CreateDb'
import WithdrawFundsDb from '../../forms/WithdrawFundsDb'
import AddFundsAcct from '../../forms/AddFundsAcct'
import _ from 'lodash'
import { useGsnBalanceMap } from '../../hooks/useGsnBalanceMap'

// TODO: remove the concept of having gsnBalance on databases from admin db
const Dashboard = (props) => {

  const [card1, setCard1] = useState(false)

  const [dbCreateOpen, setDbCreateOpen] = useState( false)

  const [withdrawFundsOpen, setWithdrawFundsOpen] = useState(false)

  const [addFundsAcctOpen, setAddFundsAcctOpen] = useState(false)

  const [sendFundsOpen, setSendFundsOpen] = useState(false)

  const [effectTrigger, triggerEffect] = useEffectTrigger()

  const {ethBalance, walletAddress} = useEthBalance(effectTrigger)

  const databases = useDatabase(props.profile, effectTrigger)

  const goDatabase = useCallback((ev) => {

    if (ev.target.tagName === 'A' || ev.target.tagName === 'BUTTON'){
      return
    }

    const selectedContract = ev.currentTarget.dataset.contractaddress

    props.dispatch({
      type: ProfileActionTypes.SET_SELECTED_DB,
      selectedDbContract: selectedContract
    })

    window.location.hash = 'databases'
  })

  const gsnBalanceMap = useGsnBalanceMap(databases, effectTrigger)

  const [selectedDb, setSelectedDb] = useState({})

  const handleWithdrawFunds = useCallback((ev) => {

    const contractAddr = ev.currentTarget.dataset.contractaddress

    setSelectedDb(_.find(databases, (db) => db.contractAddress === contractAddr))

    setWithdrawFundsOpen(true)

  }, [databases, setWithdrawFundsOpen])

  return (
    <div className="animated fadeIn">
      <Row>
        <Col sm="12" lg="6">
          <Card className="text-white bg-info">
            {!walletAddress ? <Loading margin="1" size="70"/> :
            <CardBody className="pb-0">
              <ButtonGroup className="float-right">
                <ButtonDropdown id='card1' isOpen={card1} toggle={() => setCard1(!card1)}>
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => setAddFundsAcctOpen(true)}>Add Funds</DropdownItem>
                    <DropdownItem onClick={() => setSendFundsOpen(true)}>Send Funds</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <h3>
                <a target="_blank" href={`https://testnet.elaeth.io/address/${walletAddress}/transactions`} className="text-white">
                  {ethBalance.toFixed(4)}
                </a>
              </h3>

              <div>
                <b>Account</b> ELAETHSC Balance<br/>
                <b>Address:</b>{' '}
                <a target="_blank" className="text-white" href={`https://testnet.elaeth.io/address/${walletAddress}/transactions`}>
                  {walletAddress}
                </a>
              </div>
            </CardBody>}
            <div>
              <br/>
            </div>
          </Card>
        </Col>

        <Col sm="12" lg="6">
          <Card className="text-white bg-primary">
            <CardBody className="pb-0">
              <h3>
                <a target="_blank" href="https://docs.elajs.com" className="text-white">
                  Learn <strong>elajs</strong>
                </a>
              </h3>
              <div>
                This website manages your databases.<br/>
                Learn how to connect your dApp read our docs at{' '}
                <a target="_blank" href="https://docs.elajs.com" className="text-white text-dark"><b>https://docs.elajs.com</b></a>
              </div>
            </CardBody>
            <div>
              <br/>
            </div>
          </Card>
        </Col>
      </Row>

      {ethBalance === 0 ?
        <Row>
          <Col>
            <Card className="bg-white">
              <CardBody>
                <h3>Welcome to elajs - Testnet</h3>
                <br/>
                <p>
                  To get started click the <i className="icon-settings"/> icon above and <b>Add Funds</b> to your account from
                  the Elastos ETH Testnet Faucet.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row> : ''
      }

      <Row>
        <Col>
          <Table hover responsive className="table-outline mb-0 d-none d-sm-table" style={{'backgroundColor': '#fff'}}>
            <thead className="thead-light">
              <tr>
                <th>Database Name</th>
                <th>Contract Address</th>
                <th>GSN Funds</th>
                {/* <th># of Tables</th> */}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
            {!databases ? <tr>
              <td className="text-center" colSpan="5">
                <Loading margin="0" size="100"/>
              </td>
            </tr> : (
              !databases.length ?
              <tr>
                <td className="text-center" colSpan="5">
                  No Databases - <a href="#" onClick={(ev) => {ev.preventDefault(); setDbCreateOpen(true)}}>Create Database</a>
                </td>
              </tr> :
              databases.map((database) => {
                return <tr key={database.id} className="animated fadeIn" style={{cursor: 'pointer'}} onClick={goDatabase} data-contractaddress={database.contractAddress} data-id={database.id}>
                  <td>
                    {database.dbName}
                  </td>
                  <td>
                    <a target="_blank" href={`https://testnet.elaeth.io/address/${database.contractAddress}/transactions`}>
                      {database.contractAddress}
                    </a>
                  </td>
                  <td>
                    {gsnBalanceMap[database.contractAddress] ?
                      Web3.utils.fromWei(gsnBalanceMap[database.contractAddress].toString()) + ' ETH' : ''
                    }
                  </td>
                  {/*
                  <td>
                    {database.tables.length}
                  </td>
                  */}
                  <td className="text-right">
                    {/* <button className="btn btn-primary btn-sm">Add Funds</button>{' '} */}
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={handleWithdrawFunds}
                      data-contractaddress={database.contractAddress}
                      disabled={gsnBalanceMap[database.contractAddress] && gsnBalanceMap[database.contractAddress] > 0 ? '': 'disabled'}
                    >
                      Withdraw Funds
                    </button>
                  </td>
                </tr>
              })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/*
      ************************************************************************************************
      Create DB Modal
      ************************************************************************************************
      */}
      <Modal isOpen={dbCreateOpen} style={{marginTop: '20%'}}>
        <ModalHeader>
          Create New Database
        </ModalHeader>
        <ModalBody>
          <CreateDb closeModal={() => setDbCreateOpen(false)} triggerEffect={triggerEffect}/>
        </ModalBody>
      </Modal>

      {/*
      ************************************************************************************************
      Withdraw Funds Modal
      ************************************************************************************************
      */}
      <Modal isOpen={withdrawFundsOpen} style={{marginTop: '20%', maxWidth: '600px'}}>
        <ModalHeader>
          Withdraw Funds from database: {selectedDb.dbName}
        </ModalHeader>
        <ModalBody>
          <WithdrawFundsDb
            selectedDb={selectedDb}
            gsnBalance={gsnBalanceMap[selectedDb.contractAddress]}
            closeModal={() => setWithdrawFundsOpen(false)}
            triggerEffect={triggerEffect}
          />
        </ModalBody>
      </Modal>

      {/*
      ************************************************************************************************
      Add Funds to Account Modal
      ************************************************************************************************
      */}
      <Modal isOpen={addFundsAcctOpen} style={{marginTop: '20%', maxWidth: '600px'}}>
        <ModalHeader>
          Add ELAETHSC to Account
        </ModalHeader>
        <ModalBody>
          <AddFundsAcct
            closeModal={() => setAddFundsAcctOpen(false)}
            triggerEffect={triggerEffect}
          />
        </ModalBody>
      </Modal>

      {/*
      ************************************************************************************************
      Send Funds to Account Modal
      ************************************************************************************************
      */}
      <Modal isOpen={sendFundsOpen} style={{marginTop: '20%', maxWidth: '600px'}}>
        <ModalHeader>
          Send Outgoing ELAETHSC
        </ModalHeader>
        <ModalBody>
          <p>
            Under Development
          </p>
          (This is the testnet, you can request more ELAETHSC from{' '}
          <a target="_blank" href="https://faucet.elaeth.io">faucet.elaeth.io</a>)
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary pull-right" onClick={() => setSendFundsOpen(false)}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );

}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(Dashboard)


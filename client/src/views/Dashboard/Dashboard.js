import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useEthBalance } from '../../hooks/useEthBalance'
import { useDatabase } from '../../hooks/useDatabase'
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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap'
import Loading from '../Pages/Loading'
import { EthContext } from '../../context/EthContext'
import { NetworkContext } from '../../context/NetworkContext'
import { connect } from 'react-redux'
import { ProfileActionTypes } from '../../store/redux/profile'

const Dashboard = (props) => {

  const [card1, setCard1] = useState(false)

  const [ethConfig, setEthConfig] = useContext(EthContext)
  const [network, setNetwork] = useContext(NetworkContext)

  const {ethBalance, walletAddress} = useEthBalance()

  const databases = useDatabase(props)

  const goDatabase = useCallback((ev) => {

    if (ev.target.tagName === 'A'){
      return
    }

    const selectedContract = ev.currentTarget.dataset.contractaddress

    props.dispatch({
      type: ProfileActionTypes.SET_SELECTED_DB,
      selectedDbContract: selectedContract
    })

    window.location.hash = 'databases'
  })

  return (
    <div className="animated fadeIn">
      <Row>
        <Col sm="12" lg="6">
          <Card className="text-white bg-info">
            <CardBody className="pb-0">
              <ButtonGroup className="float-right">
                <ButtonDropdown id='card1' isOpen={card1} toggle={() => setCard1(!card1)}>
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Add Funds</DropdownItem>
                    <DropdownItem>Send Funds</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <h3>
                <a href="https://docs.elastosjs.com" className="text-white">
                  {ethBalance.toFixed(4)}
                </a>
              </h3>

              <div>
                ELASC Balance<br/>
                <b>Address:</b>{' '}
                <a target="_blank" className="text-white" href={`https://testnet.elaeth.io/address/${walletAddress}/transactions`}>
                  {walletAddress}
                </a>
              </div>
            </CardBody>
            <div>
              <br/>
            </div>
          </Card>
        </Col>

        <Col sm="12" lg="6">
          <Card className="text-white bg-primary">
            <CardBody className="pb-0">
              <h3>
                <a href="https://docs.elastosjs.com" className="text-white">
                  Learn ElastosJS
                </a>
              </h3>
              <div>
                Your database is a smart contract, to learn how to connect your dApp read our docs at{' '}
                <a href="https://docs.elastosjs.com" className="text-white text-dark"><b>https://docs.elastosjs.com</b></a>
              </div>
            </CardBody>
            <div>
              <br/>
            </div>
          </Card>
        </Col>
      </Row>

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
                  No Databases - <a href="#">Create Database</a>
                </td>
              </tr> :
              databases.map((database) => {
                return <tr key={database.name} style={{cursor: 'pointer'}} onClick={goDatabase} data-contractaddress={database.contractAddress}>
                  <td>
                    {database.name}
                  </td>
                  <td>
                    <a target="_blank" href={`https://testnet.elaeth.io/address/${database.contractAddress}/transactions`}>
                      {database.contractAddress}
                    </a>
                  </td>
                  <td>
                    {database.gsnBalance.toFixed(5)}
                  </td>
                  {/*
                  <td>
                    {database.tables.length}
                  </td>
                  */}
                  <td className="text-right">
                    <button className="btn btn-primary btn-sm">Add Funds</button>{' '}
                    <button className="btn btn-warning btn-sm">Withdraw Funds</button>
                  </td>
                </tr>
              })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );

}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(Dashboard)


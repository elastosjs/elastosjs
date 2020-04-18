import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useEthBalance } from '../../hooks/useEthBalance'
import { useDatabase } from '../../hooks/useDatabase'
import { useForceUpdate } from '../../hooks/useForceUpdate'
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
  DropdownToggle, Modal, ModalBody, ModalHeader,
  Progress,
  Row,
  Table,
} from 'reactstrap'
import Loading from '../Pages/Loading'
import { EthContext } from '../../context/EthContext'
import { NetworkContext } from '../../context/NetworkContext'
import { connect } from 'react-redux'
import { ProfileActionTypes } from '../../store/redux/profile'
import CreateDb from '../../forms/CreateDb'
import Web3 from 'web3'

const Dashboard = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [card1, setCard1] = useState(false)

  const [gsnBalanceMap, setGsnBalanceMap] = useState({})

  const {ethBalance, walletAddress} = useEthBalance()

  const [dbCreateOpen, setDbCreateOpen] = useState( false)

  const forceUpdate = useForceUpdate()

  const databases = useDatabase(props.profile, forceUpdate)

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

  useEffect(() => {
    (async () => {

      const elajsUser = ethConfig.elajsUser
      const gsnBalanceMap = {}

      databases.map(async (db) => {
        try {
          await ethConfig.elajsUser.defaultWeb3.currentProvider.baseProvider.enable()
          elajsUser.setDatabase(db.contractAddress)
          gsnBalanceMap[db.contractAddress] = await elajsUser.getGSNBalance()
          setGsnBalanceMap(Object.assign({}, gsnBalanceMap))
        } catch (err){
          console.error(`Error fetching GSNBalance for contract address: ${db.contractAddress}`, err)
        }
      })


    })()
  }, [databases, setGsnBalanceMap])

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
                <b>Account</b> ELASC Balance<br/>
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
                  No Databases - <a href="#" onClick={(ev) => {ev.preventDefault(); setDbCreateOpen(true)}}>Create Database</a>
                </td>
              </tr> :
              databases.map((database) => {
                return <tr key={database.id} style={{cursor: 'pointer'}} onClick={goDatabase} data-contractaddress={database.contractAddress} data-id={database.id}>
                  <td>
                    {database.dbName}
                  </td>
                  <td>
                    <a target="_blank" href={`https://testnet.elaeth.io/address/${database.contractAddress}/transactions`}>
                      {database.contractAddress}
                    </a>
                  </td>
                  <td>
                    {database.gsnBalance ?
                      database.gsnBalance.toFixed(5) + ' ETH':
                      (
                        gsnBalanceMap[database.contractAddress] ?
                          Web3.utils.fromWei(gsnBalanceMap[database.contractAddress].toString()) + ' ETH' : ''
                      )
                    }
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
      <Modal isOpen={dbCreateOpen} style={{marginTop: '20%'}}>
        <ModalHeader>
          Create New Database
        </ModalHeader>
        <ModalBody>
          <CreateDb closeModal={() => setDbCreateOpen(false)}/>
        </ModalBody>
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


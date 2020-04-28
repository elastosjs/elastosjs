import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import {
  Popover,
  PopoverBody,
  PopoverHeader,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardText,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Label,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane, ModalHeader, ModalBody, ModalFooter, Modal
} from 'reactstrap'
import styled from 'styled-components'
import Loading from '../Pages/Loading'
import Web3 from 'web3'
import { toastr } from 'react-redux-toastr'

import CreateDb from '../../forms/CreateDb'
import CreateTable from '../../forms/CreateTable'
import AddFundsDb from '../../forms/AddFundsDb'

import DatabaseTable from './DatabaseTable'
import DatabaseData from './DatabaseData'

import classnames from 'classnames'
import { useDatabase } from '../../hooks/useDatabase'
import { useTable } from '../../hooks/useTable'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ProfileActionTypes } from '../../store/redux/profile'
import { useEffectTrigger } from '../../hooks/useEffectTrigger'
import { EthContext } from '../../context/EthContext'

const DatabaseView = (props) => {

  const [ethConfig, ] = useContext(EthContext)

  const [effectTrigger, triggerEffect] = useEffectTrigger()

  const [dbOpen, setDbOpen] = useState(false)

  const [createTableOpen, setCreateTableOpen] = useState(false)

  const [dbAddFundsOpen, setDbAddFundsOpen] = useState( false)

  const [dbCreateOpen, setDbCreateOpen] = useState( false)

  const [activeTab, setActiveTab] = useState('0');

  const [gsnBalanceHelpOpen, setGsnBalanceHelpOpen] = useState(false)

  const [gsnBalanceMap, setGsnBalanceMap] = useState({})

  const [ready, setReady] = useState(false)

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  /*
  ************************************************************************
  * Database Data
  ************************************************************************
   */
  const databases = useDatabase(props.profile, effectTrigger, setReady)

  // this works fine for admin db too because it's only a public call
  useEffect(() => {
    (async () => {

      const gsnBalanceMap = {}
      const elajsDbUser = ethConfig.elajsDbUser

      databases.map(async (db) => {
        try {
          elajsDbUser.setDatabase(db.contractAddress)
          await elajsDbUser.defaultWeb3.currentProvider.baseProvider.enable() // we should call enable for each setDatabase change
          gsnBalanceMap[db.contractAddress] = await elajsDbUser.getGSNBalance()
          setGsnBalanceMap(Object.assign({}, gsnBalanceMap))
        } catch (err){
          console.error(`Error fetching GSNBalance for contract address: ${db.contractAddress}`, err)
        }
      })
    })()
  }, [databases, setGsnBalanceMap, effectTrigger])

  const [selectedTable, setSelectedTable] = useState()

  const {tableMetadata, tableSchema} = useTable(selectedTable, props.profile.isAdmin)

  /*
  useEffect(() => {

    if (!databases){
      return
    }

    // for admin there is only 1 DB
    if (!props.profile.selectedDbContract && props.profile.isAdmin){
      props.dispatch({
        type: ProfileActionTypes.SET_SELECTED_DB,
        selectedDbContract: databases[0].contractAddress
      })
      return
    }

  }, [props.profile.selectedDbContract, databases])
   */

  /**
   * Any scenario where we are selecting databases is not in admin mode, in this case
   * we are connecting our secondary ela-js instance to each contract
   *
   */
  const selectDatabase = useCallback((ev) => {
    setSelectedTable('')

    props.dispatch({
      type: ProfileActionTypes.SET_SELECTED_DB,
      selectedDbContract: ev.currentTarget.dataset.dbcontractaddr
    })
  })

  const selectTable = useCallback((ev) => {
    ev.preventDefault()
    setSelectedTable(ev.currentTarget.dataset.tablename)
  })


  /*
  ************************************************************************
  * Generate Databases Dropdown
  ************************************************************************
   */
  const databaseDropdown = useMemo(() => {

    if (!databases){
      return <div></div>
    }

    // no database selected, show them all
    if (!props.profile.selectedDbContract){
      return <DropdownMenu>
        {databases.map((db) => {
          return <DropdownItem key={db.dbName} onClick={selectDatabase} data-dbcontractaddr={db.contractAddress}>{db.dbName}</DropdownItem>
        })}
      </DropdownMenu>
    }

    const otherDbs = _.reject(databases, (obj) => obj.contractAddress === props.profile.selectedDbContract)

    return <DropdownMenu>
      <DropdownItem header>Change Database</DropdownItem>
      <DropdownItem disabled>{selectedDb ? selectedDb.name : 'None'}</DropdownItem>
      <DropdownItem divider />
      {otherDbs.length > 0 ? otherDbs.map((db) => {
        return <DropdownItem key={db.dbName} onClick={selectDatabase} data-dbcontractaddr={db.contractAddress}>{db.dbName}</DropdownItem>
      }) : <DropdownItem>No Other Databases</DropdownItem>}
    </DropdownMenu>

  }, [databases, props.profile.selectedDbContract])

  // returns selected db name from contract - gsnBalance is held separately so this can be memoized
  const selectedDb = useMemo(() => {

    if (!databases){
      return
    }

    return _.find(databases, (db) => db.contractAddress === props.profile.selectedDbContract)
  }, [databases, props.profile.selectedDbContract])

  const handleDeleteTable = useCallback((ev) => {
    toastr.info('Under development')
  })

  const handleViewData = useCallback((ev) => {
    setSelectedTable(ev.currentTarget.dataset.tablename)
    setActiveTab('2')
  })

  return (
    !ready ? <Loading/> :
    <div className="animated fadeIn">
      <Row>
        <Col lg="8">
          <Dropdown isOpen={dbOpen} toggle={() => setDbOpen(!dbOpen)}>
            <Label className="mr-2">
              Database:
            </Label>
            <DropdownToggle caret>
              {selectedDb ? selectedDb.dbName : 'None Selected'}
            </DropdownToggle>
            {databaseDropdown}
          </Dropdown>
        </Col>
        <Col lg="4" className="text-right">
          <button className="btn btn-primary" onClick={() => setDbCreateOpen(true)}>Create New Database</button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '0' })}
                onClick={() => { toggle('0'); }}
              >
                Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                disabled={!selectedDb}
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
              >
                Tables
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                disabled={!selectedDb}
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
              >
                Data
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            {/*
            ************************************************************************************************
            Info Tab Pane
            ************************************************************************************************
            */}
            <TabPane tabId="0">
              {selectedDb ?
                <Row>
                  <Col sm="6" lg="3">
                    <Card className="text-white bg-info">
                      <CardBody>
                        <ButtonGroup className="float-right">
                          <button onClick={() => setDbAddFundsOpen(true)} className="btn btn-primary btn-sm">Add Funds</button>
                        </ButtonGroup>
                        <h3>
                          {props.profile.isAdmin && selectedDb && selectedDb.gsnBalance ?
                            selectedDb.gsnBalance.toFixed(5) :
                            (
                              selectedDb && gsnBalanceMap[selectedDb.contractAddress] ?
                                parseFloat(Web3.utils.fromWei(gsnBalanceMap[selectedDb.contractAddress])).toFixed(4) : 0
                            )
                          }
                        </h3>

                        <div>
                          GSN Balance
                          <Popover placement="bottom" isOpen={gsnBalanceHelpOpen} target="GsnBalanceHelp" toggle={() => setGsnBalanceHelpOpen(!gsnBalanceHelpOpen)}>
                            <PopoverHeader>GSN Balance</PopoverHeader>s
                            <PopoverBody>
                              Your GSN Balance is how much funds your smart contract has to allow anonymous (ephemeral) transactions.
                            </PopoverBody>
                          </Popover>
                          <HoverIcon id="GsnBalanceHelp" className="fa fa-question-circle fa-lg ml-1"/>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm="6" lg="9">
                    <Card className="text-white bg-primary">
                      <CardBody>
                        <h3>
                          Smart Contract Address
                        </h3>

                        <div>
                          <a target="_blank"
                             href={`https://testnet.elaeth.io/address/${props.profile.selectedDbContract}/transactions`}
                             className="text-white"
                          >
                            {props.profile.selectedDbContract}
                          </a>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row> :
                <div className="text-muted">
                  Please select a database or{' '}
                  <a href="#" onClick={(ev) => {ev.preventDefault();setDbCreateOpen(true)}}>
                    Create a New Database
                  </a>
                </div>
              }
            </TabPane>
            {/*
            ************************************************************************************************
            Tables Tab Pane
            ************************************************************************************************
            */}
            <TabPane tabId="1">
              <Row>
                <Col>
                  {selectedTable ?
                    <div>
                      <button className="btn btn-info pull-right mb-3" onClick={() => setCreateTableOpen(true)}>Create Table</button>
                      <Breadcrumb>
                        <BreadcrumbItem>
                          <a href="#" onClick={selectTable} data-tablename="" >
                            Back to Tables List
                          </a>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{selectedTable}</BreadcrumbItem>
                      </Breadcrumb>
                    </div>  : ''}
                  {selectedTable ?

                    <DatabaseTable setActiveTab={setActiveTab} tableMetadata={tableMetadata} tableSchema={tableSchema}/> :

                    <div>
                      <button className="btn btn-info pull-right mb-3" onClick={() => setCreateTableOpen(true)}>Create Table</button>
                      <Table hover responsive className="table-outline mb-0 d-none d-sm-table" style={{clear: 'both', 'backgroundColor': '#fff'}}>
                        <thead className="thead-light">
                        <tr>
                          <th>Table Name</th>
                          <th>Rows</th>
                          {/* <th># of Tables</th> */}
                          <th className="text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!selectedDb || !selectedDb.tables || selectedDb.tables.length === 0 ?
                          <tr>
                            <td colSpan="3">
                              No Tables - <a href="#" onClick={(ev) => {ev.preventDefault();setCreateTableOpen(true)}}>Create Table</a>
                            </td>
                          </tr> :
                          selectedDb.tables.map((table, i) => {

                            const style = {display: 'flex', justifyContent: 'flex-end'}
                            if (i === 0){
                              style.borderTop = 0
                            }

                            return <tr key={table.name}>
                              <td>
                                <a href="#" onClick={selectTable} data-tablename={table.name}>
                                  {table.name}
                                </a>
                              </td>
                              <td>
                                0
                              </td>
                              <td className="text-right align-items-center" style={style}>
                                <button className="btn btn-primary mr-3" onClick={handleViewData} data-tablename={table.name}>View Data</button>{' '}
                                <HoverIcon
                                  className="cui-trash icons font-2xl"
                                  onClick={handleDeleteTable}
                                  data-tablename={table.name}
                                />
                              </td>
                            </tr>
                          })
                        }
                        </tbody>
                      </Table>
                    </div>
                  }
                </Col>
              </Row>
            </TabPane>
            {/*
            ************************************************************************************************
            Data Tab Pane
            ************************************************************************************************
            */}
            <TabPane tabId="2">
              {activeTab === '2' ?
                <DatabaseData
                  databases={databases}
                  selectedTable={selectedTable}
                  setSelectedTable={setSelectedTable}
                  tableMetadata={tableMetadata}
                  tableSchema={tableSchema}
                /> : ''}
            </TabPane>
          </TabContent>
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
          <CreateDb
            closeModal={() => setDbCreateOpen(false)}
            triggerEffect={triggerEffect}
          />
        </ModalBody>
      </Modal>

      {/*
      ************************************************************************************************
      Create Table Modal
      ************************************************************************************************
      */}
      <Modal isOpen={createTableOpen} style={{marginTop: '5%'}}>
        <ModalHeader>
          Create New Table
        </ModalHeader>
        <ModalBody>
          <CreateTable
            closeModal={() => setCreateTableOpen(false)}
            selectedDb={selectedDb}
            triggerEffect={triggerEffect}
          />
        </ModalBody>
      </Modal>

      {/*
      ************************************************************************************************
      Add Funds to DB Modal
      ************************************************************************************************
      */}
      <Modal isOpen={dbAddFundsOpen} style={{marginTop: '20%'}}>
        <ModalHeader>
          Add Funds to Database: <b className="text-primary">{selectedDb ? selectedDb.dbName : ''}</b>
        </ModalHeader>
        <ModalBody>
          <AddFundsDb
            closeModal={() => setDbAddFundsOpen(false)}
            selectedDb={selectedDb}
            gsnBalance={selectedDb ? parseInt(gsnBalanceMap[selectedDb.contractAddress]) : 0}
            triggerEffect={triggerEffect}
          />
        </ModalBody>
      </Modal>
    </div>
  )

}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile
  }
}

export default connect(mapStateToProps)(DatabaseView)

const HoverIcon = styled.i`
  cursor: pointer;

  :hover {
    color: #777;
  }
`

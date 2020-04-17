import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Badge,
  Button,
  ButtonDropdown,
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
import CreateDb from '../../forms/CreateDb'
import DatabaseTable from './DatabaseTable'
import DatabaseData from './DatabaseData'
import classnames from 'classnames'
import { useDatabase } from '../../hooks/useDatabase'
import { useTable } from '../../hooks/useTable'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ProfileActionTypes } from '../../store/redux/profile'

const DatabaseView = (props) => {

  const [dbOpen, setDbOpen] = useState(false)

  const [dbFundOpen, setDbFundOpen] = useState( false)

  const [dbCreateOpen, setDbCreateOpen] = useState( false)

  const [activeTab, setActiveTab] = useState('0');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  /*
  ************************************************************************
  * Database Data
  ************************************************************************
   */
  const databases = useDatabase(props.profile)

  const [selectedTable, setSelectedTable] = useState()

  const {tableMetadata, tableSchema} = useTable(selectedTable)

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
  const selectDatabase = useCallback(() => {
    // setSelectedTable(ev.currentTarget.dataset.contractaddress)
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
          return <DropdownItem key={db.dbName} onClick={selectDatabase} data-dbname={db.dbName}>{db.dbName}</DropdownItem>
        })}
      </DropdownMenu>
    }

    const otherDbs = _.reject(databases, (obj) => obj.contractAddress === props.profile.selectedDbContract)

    return <DropdownMenu>
      <DropdownItem header>Change Database</DropdownItem>
      <DropdownItem disabled>{selectedDb ? selectedDb.name : 'None'}</DropdownItem>
      <DropdownItem divider />
      {otherDbs.length > 1 ? otherDbs.map((db) => {
        return <DropdownItem key={db.dbName} onClick={selectDatabase}>{db.dbName}</DropdownItem>
      }) : <DropdownItem>No Other Databases</DropdownItem>}
    </DropdownMenu>

  }, [databases, props.profile.selectedDbContract])

  // returns selected db name from contract
  const selectedDb = useMemo(() => {

    if (!databases){
      return
    }

    return _.find(databases, (db) => db.contractAddress === props.profile.selectedDbContract)
  }, [databases, props.profile.selectedDbContract])

  return (
    !databases ? <Loading/> :
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
                          <button className="btn btn-primary btn-sm">Add Funds</button>
                        </ButtonGroup>
                        <h3>
                          {selectedDb && selectedDb.gsnBalance ? selectedDb.gsnBalance.toFixed(5) : 0}
                        </h3>

                        <div>
                          GSN Balance
                          <HelpIcon className="fa fa-question-circle fa-lg ml-1"/>
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
                  Please select a database or <a href="#" onClick={(ev) => {ev.preventDefault();setDbCreateOpen(true)}}>Create a New Database</a>
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
                    <Breadcrumb>
                      <BreadcrumbItem>
                        <a href="#" onClick={selectTable} data-tablename="" >
                          Back to Tables List
                        </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem active>{selectedTable}</BreadcrumbItem>
                    </Breadcrumb> : ''}
                  {selectedTable ?

                    <DatabaseTable setActiveTab={setActiveTab} tableMetadata={tableMetadata} tableSchema={tableSchema}/> :

                    <Table hover responsive className="table-outline mb-0 d-none d-sm-table" style={{'backgroundColor': '#fff'}}>
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
                            No Tables - <a href="#">Create Table</a>
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
                              <button className="btn btn-primary mr-3">View Data</button>{' '}
                              <i className="cui-trash icons font-2xl"/>
                            </td>
                          </tr>
                        })
                      }
                      </tbody>
                    </Table>
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
      <Modal isOpen={dbCreateOpen} style={{marginTop: '20%'}}>
        <ModalHeader>
          Create New Database
        </ModalHeader>
        <ModalBody>
          <CreateDb closeModal={() => setDbCreateOpen(false)}/>
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

const HelpIcon = styled.i`

  cursor: pointer;

  :hover {
    color: #ccc;
  }
`

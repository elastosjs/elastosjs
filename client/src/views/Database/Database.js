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
import { CreateDb } from '../../forms/CreateDb'
import DatabaseTable from './DatabaseTable'
import DatabaseData from './DatabaseData'
import classnames from 'classnames'
import { useDatabase } from '../../hooks/useDatabase'
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

  const databases = useDatabase(props.profile.isAdmin)

  useEffect(() => {

    if (!databases){
      return
    }

    // reset the selected table if database changes
    props.dispatch({
      type: ProfileActionTypes.SET_SELECTED_TABLE,
      selectedTable: ''
    })

    // for admin there is only 1 DB
    if (!props.profile.selectedDbContract && props.profile.isAdmin){
      props.dispatch({
        type: ProfileActionTypes.SET_SELECTED_DB,
        selectedDbContract: databases[0].contractAddress
      })
      return
    }

  }, [props.profile.selectedDbContract, databases])

  const goTable = useCallback((ev) => {
    ev.preventDefault()

    props.dispatch({
      type: ProfileActionTypes.SET_SELECTED_TABLE,
      selectedTable: ev.currentTarget.dataset.tablename
    })
  })

  /*
  useEffect(() => {

  }, [props.profile.selectedTable])
  */

  const selectDatabase = useCallback(() => {

  }, [])

  const databaseDropdown = useMemo(() => {

    if (!databases){
      return
    }

    // no database selected, show them all
    if (!props.profile.selectedDbContract){
      return <DropdownMenu>
        {databases.map((db) => {
          return <DropdownItem key={db.name} onClick={selectDatabase} data-dbname={db.name}>{db.name}</DropdownItem>
        })}
      </DropdownMenu>
    }

    const otherDbs = _.reject(databases, (obj) => obj.contractAddress === props.profile.selectedDbContract)

    return <DropdownMenu>
      <DropdownItem header>Change Database</DropdownItem>
      <DropdownItem disabled>{selectedDb.name}</DropdownItem>
      <DropdownItem divider />
      {otherDbs.length > 1 ? otherDbs.map((db) => {
        return <DropdownItem key={db.name} onClick={selectDatabase}>{db.name}</DropdownItem>
      }) : <DropdownItem>No Other Databases</DropdownItem>}
    </DropdownMenu>

  }, [databases, props.profile.selectedDbContract])

  const selectedDb = useMemo(() => {
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
              {selectedDb || 'None'}
            </DropdownToggle>
            {databaseDropdown}
          </Dropdown>
        </Col>
        <Col lg="4" className="text-right">
          <button className="btn btn-primary">Create New Database</button>
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
                          {selectedDb ? selectedDb.gsnBalance.toFixed(5) : 0}
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
                  {props.profile.selectedTable ?
                    <Breadcrumb>
                      <BreadcrumbItem>
                        <a href="#" onClick={goTable} data-tablename="" >
                          Back to Tables List
                        </a>
                      </BreadcrumbItem>
                      <BreadcrumbItem active>{props.profile.selectedTable}</BreadcrumbItem>
                    </Breadcrumb> : ''}
                  {props.profile.selectedTable ?
                  <DatabaseTable setActiveTab={setActiveTab}/> :
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
                            <a href="#" onClick={goTable} data-tablename={table.name}>
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
                  </Table>}
                </Col>
              </Row>
            </TabPane>
            {/*
            ************************************************************************************************
            Data Tab Pane
            ************************************************************************************************
            */}
            <TabPane tabId="2">
              {activeTab === '2' ? <DatabaseData databases={databases}/> : ''}
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

import React, { useState, useEffect, useCallback } from 'react'
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
  TabPane
} from 'reactstrap'
import Loading from '../Pages/Loading'
import classnames from 'classnames'
import { useDatabase } from '../../hooks/useDatabase'
import { connect } from 'react-redux'
import _ from 'lodash'

const DatabaseView = (props) => {

  const [dbOpen, setDbOpen] = useState(false)

  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const databases = useDatabase(props)

  const [selectedDb, setSelectedDb] = useState()

  useEffect(() => {
    setSelectedDb(_.find(databases, (db) => {
      return db.contractAddress === props.profile.selectedDbContract
    }))
  }, [props.profile.selectedDbContract, databases])

  const goTable = useCallback((ev) => {

  })

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
              ElastosJS
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Change Database</DropdownItem>
              <DropdownItem disabled>ElastosJS</DropdownItem>
              <DropdownItem divider />
              {!databases || databases.length === 1 ?
                <DropdownItem disabled>No Other Databases</DropdownItem> :
                _.reject(databases, (obj) => obj.contractAddress === props.profile.selectedDbContract).map((db) => {
                  return <DropdownItem>{db.name}</DropdownItem>
                })
              }
            </DropdownMenu>
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
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
              >
                Tables
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
              >
                Data
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col>
                  <Breadcrumb>
                    <BreadcrumbItem active>List</BreadcrumbItem>
                  </Breadcrumb>
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
                      selectedDb.tables.map((table) => {
                        return <tr key={table.name}>
                          <td>
                            <a href="#" onClick={goTable}>
                              {table.name}
                            </a>
                          </td>
                          <td>
                            0
                          </td>
                          <td className="text-right align-items-center" style={{display: 'flex', justifyContent: 'flex-end', borderTop: 0}}>
                            <button className="btn btn-primary mr-3">View Data</button>{' '}
                            <i className="cui-trash icons font-2xl"/>
                          </td>
                        </tr>
                      })
                    }
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Special Title Treatment</CardTitle>
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                    <Button>Go somewhere</Button>
                  </Card>
                </Col>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Special Title Treatment</CardTitle>
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                    <Button>Go somewhere</Button>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  )

}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(DatabaseView)



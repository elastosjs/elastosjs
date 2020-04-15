import React, {useCallback, useState, useMemo } from 'react'
import {
  Col,
  Row,
  Table,
  Modal, Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle, Label
} from 'reactstrap'
import Loading from '../Pages/Loading'
import { useTableMetadata } from '../../hooks/useTableMetadata'
import { useTableData } from '../../hooks/useTableData'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ProfileActionTypes } from '../../store/redux/profile'


const DatabaseData = (props) => {

  const [tableOpen, setTableOpen] = useState(false)

  const databases = props.databases

  const tables = _.find(databases, (db) => db.contractAddress === props.profile.selectedDbContract).tables

  // the parent will automatically change this
  const {metadata, schema} = useTableMetadata(props.profile.selectedTable)

  const tableData = useTableData(props.profile.selectedTable, schema)

  // if the database changes we need to reload everything
  // TODO: this requires fully resetting elajs, we haven't handled this yet
  /*
  useEffect(() => {

  }, [props.profile.selectedDbContract])
  */

  const selectTable = useCallback((ev) => {
    props.dispatch({
      type: ProfileActionTypes.SET_SELECTED_TABLE,
      selectedTable: ev.currentTarget.dataset.tablename
    })
  }, [])

  const tableDropdown = useMemo(() => {

    // no table selected, show them all
    if (!props.profile.selectedTable){

      return <DropdownMenu>
        {tables.map((table) => {
          return <DropdownItem key={table.name} onClick={selectTable} data-tablename={table.name}>{table.name}</DropdownItem>
        })}
      </DropdownMenu>
    }

    const otherTables = _.reject(tables, (obj) => obj.name === props.profile.selectedTable)

    return <DropdownMenu>
      <DropdownItem header>Change Table</DropdownItem>
      <DropdownItem disabled>{props.profile.selectedTable}</DropdownItem>
      <DropdownItem divider />
      {otherTables.length > 1 ? otherTables.map((table) => {
        return <DropdownItem key={table.name} onClick={selectTable}>{table.name}</DropdownItem>
      }) : <DropdownItem>No Other Tables</DropdownItem>}
    </DropdownMenu>

  }, [tables, props.profile.selectedTable])

  return <div>
    <Row className="mb-4">
      <Col lg="8">
        <Dropdown isOpen={tableOpen} toggle={() => setTableOpen(!tableOpen)}>
          <Label className="mr-2">
            Table:
          </Label>
          <DropdownToggle caret>
            {props.profile.selectedTable || 'None'}
          </DropdownToggle>
          {tableDropdown}
        </Dropdown>
      </Col>
      <Col lg="4" className="text-right">
        {/* <button className="btn btn-primary">Create New Database</button> */}
      </Col>
    </Row>
    {props.profile.selectedTable ?
      (schema ?
          <Table hover responsive className="table-outline mb-0 d-none d-sm-table"
                 style={{ 'backgroundColor': '#fff' }}>
            <thead className="thead-light">
            <tr>
              <th>
                Row
              </th>
              <th>
                ID
              </th>
              {schema.map((col) => {
                return <th key={col.name}>
                  {col.name}
                </th>
              })}
            </tr>
            </thead>
            <tbody>
            {tableData.map((row, i) => {
              return <tr key={i}>
                <td>
                  {i}
                </td>
                {row.map((colData, j) => {
                  return <td key={j}>
                    {colData}
                  </td>
                })}
              </tr>
            })}
            </tbody>
          </Table> : <Loading/>
      )
      : <div></div>
    }
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(DatabaseData)

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
import { useTable } from '../../hooks/useTable'
import { useTableData } from '../../hooks/useTableData'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ProfileActionTypes } from '../../store/redux/profile'
import Web3 from 'web3'

const DatabaseData = (props) => {

  const {
    databases,
    selectedTable,
    setSelectedTable,
    tableMetadata,
    tableSchema
  } = props

  const [tableOpen, setTableOpen] = useState(false)

  const tables = _.find(databases, (db) => db.contractAddress === props.profile.selectedDbContract).tables

  const tableData = useTableData(selectedTable, tableSchema)

  const tableDropdown = useMemo(() => {

    if (!tables){
      return
    }

    // no table selected, show them all
    if (!selectedTable){

      return <DropdownMenu>
        {tables.map((table) => {
          return <DropdownItem
            key={table.name}
            onClick={() => setSelectedTable(table.name)}
            data-tablename={table.name}
          >
            {table.name}
          </DropdownItem>
        })}
      </DropdownMenu>
    }

    const otherTables = _.reject(tables, (obj) => obj.name === selectedTable)

    return <DropdownMenu>
      <DropdownItem header>Change Table</DropdownItem>
      <DropdownItem disabled>{selectedTable}</DropdownItem>
      <DropdownItem divider />
      {otherTables.length ? otherTables.map((table) => {
        return <DropdownItem key={table.name} onClick={() => setSelectedTable(table.name)}>
          {table.name}
        </DropdownItem>
      }) : <DropdownItem>No Other Tables</DropdownItem>}
    </DropdownMenu>

  }, [tables, selectedTable])

  return <div>
    <Row className="mb-4">
      <Col lg="8">
        <Dropdown isOpen={tableOpen} toggle={() => setTableOpen(!tableOpen)}>
          <Label className="mr-2">
            Table:
          </Label>
          <DropdownToggle caret>
            {selectedTable || 'None'}
          </DropdownToggle>
          {tableDropdown}
        </Dropdown>
      </Col>
      <Col lg="4" className="text-right">
        {/* <button className="btn btn-primary">Create New Database</button> */}
      </Col>
    </Row>
    {selectedTable ?
      (tableSchema ?
        <Table hover responsive className="table-outline mb-0 d-none d-sm-table animated fadeIn"
               style={{ 'backgroundColor': '#fff' }}>
          <thead className="thead-light">
          <tr>
            <th>
              Row
            </th>
            <th>
              ID
            </th>
            {tableSchema.map((col) => {
              return <th key={col.name}>
                {col.name}
              </th>
            })}
          </tr>
          </thead>
          <tbody>
          {tableData.map((row, i) => {
            return <tr className="animated fadeIn" key={i}>
              <td>
                {i}
              </td>
              {row.map((colData, j) => {
                return <td key={j}>
                  {j === 0 ? colData : getColData(tableSchema[j-1], colData)}
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

const getColData = (col, val) => {

  // TODO: fix this
  if (col && col.type){
    switch (col.type){
      case 'BOOL':
        val = Web3.utils.hexToNumber(val)
        break

      case 'STRING':
        val = Web3.utils.hexToString(val)
        break
    }
  }

  return val
}

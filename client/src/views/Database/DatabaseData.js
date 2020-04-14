import React, {useCallback, useState, useEffect } from 'react'
import {
  Col,
  Row,
  Table,
  Modal,Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap'
import Loading from '../Pages/Loading'
import { useTableMetadata } from '../../hooks/useTableMetadata'
import { useTableData } from '../../hooks/useTableData'
import { connect } from 'react-redux'


const DatabaseData = (props) => {

  const [tableOpen, setTableOpen] = useState(false)

  // the parent will automatically change this
  const {metadata, schema} = useTableMetadata(props.profile.selectedTable)

  const tableData = useTableData(props.profile.selectedTable, schema)

  // if the database changes we need to reload everything
  // TODO: this requires fully resetting elajs, we haven't handled this yet
  /*
  useEffect(() => {

  }, [props.profile.selectedDbContract])
  */

  return <div>
    {schema ?
    <Table hover responsive className="table-outline mb-0 d-none d-sm-table" style={{'backgroundColor': '#fff'}}>
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
      {tableData && tableData.length ? <tbody>
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
      </tbody> : <tbody/>}
    </Table> : <Loading/>}
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(DatabaseData)

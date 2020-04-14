import React, {useCallback, useState, useEffect } from 'react'
import {
  Col,
  Row,
  Table,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { connect } from 'react-redux'
import Loading from '../Pages/Loading'
import { useTableMetadata } from '../../hooks/useTableMetadata'


const DatabaseTable = (props) => {

  const {metadata, schema} = useTableMetadata(props.profile.selectedTable)

  const [helpModal, setHelpModal] = useState({
    permissionType: '',
    permissionHelpMsg: '',
    show: false,
  })

  useEffect(() => {

    if (!metadata || !metadata.permission){
      return
    }

    let permissionType, msg

    switch (parseInt(metadata.permission)){
      case 1:
        permissionType = 'Private'
        msg = 'Only the Contract Owner can modify this table'
        break
      case 2:
        permissionType = 'Public'
        msg = 'Anyone can insert into this table, but only the row owner can edit their row'
        break
      case 3:
        permissionType = 'Public + Admin Editable'
        msg = 'Anyone can insert into this table, only the row owner can edit their row, but the Contract Owner can edit anything'
        break
    }

    setHelpModal({
      ...helpModal,
      permissionType,
      permissionHelpMsg: msg,
    })
  }, [metadata])

  const permissionTypeHelp = useCallback((ev) => {
    ev.preventDefault()

    setHelpModal({
      ...helpModal,
      show: true
    })
  })

  return (
    <div>
      <Row>
        <Col lg="8">

        </Col>
        <Col className="text-right" lg="4">
          Permission Type:{' '}
          <a href="#" onClick={permissionTypeHelp}>
            <b>{helpModal.permissionType}</b>
          </a>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table hover responsive className="table-outline mb-0 d-none d-sm-table" style={{'backgroundColor': '#fff'}}>
            <thead className="thead-light">
            <tr>
              <th>Column</th>
              <th>Data Type</th>
              {/* <th># of Tables</th> */}
              <th className="text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {!schema ? <tr><td className="text-center" colSpan="3"><Loading margin="0" size="100"/></td></tr> : (!schema.length === 0 ?
              <tr>
                <td colSpan="3">
                  No Columns - <a href="#">Create Column</a>
                </td>
              </tr> :
              schema.map((col, i) => {

                const style = {display: 'flex', justifyContent: 'flex-end'}
                if (i === 0){
                  style.borderTop = 0
                }

                return <tr key={col.name}>
                  <td>
                    {col.name}
                  </td>
                  <td>
                    {col.type}
                  </td>
                  <td className="text-right align-items-center" style={style}>
                    <i className="cui-trash icons font-2xl"/>
                  </td>
                </tr>
              })
            )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal isOpen={helpModal.show} toggle={() => setHelpModal({...helpModal, show: false})} style={{marginTop: '20%'}}>
        <ModalHeader>
          Table Permissions
        </ModalHeader>
        <ModalBody>
          {helpModal.permissionHelpMsg}<br/>
          <br/>
          <span className="text-muted">This cannot be changed on an existing table.</span>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-elastos btn-block" onClick={() => setHelpModal({...helpModal, show: false})}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(DatabaseTable)

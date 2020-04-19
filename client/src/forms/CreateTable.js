import React, { useState, useCallback, useContext } from 'react'
import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ListGroup,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Card,
  CardBody
} from 'reactstrap'
import _ from 'lodash'
import { useEthBalance } from '../hooks/useEthBalance'
import { toastr } from 'react-redux-toastr'
import { LoadingOverlay } from '../views/Pages/Loading'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Web3 from 'web3'
import { EthContext } from '../context/EthContext'

const DIRECTION = {
  UP: 0,
  DOWN: 1
}

const CreateTable = (props) => {

  const [ethConfig, setEthConfig] = useContext(EthContext)

  const [tableName, setTableName] = useState('')

  const { ethBalance, walletAddress } = useEthBalance()

  const [pendingCreate, setPendingCreate] = useState(false)

  const [cols, setCols] = useState([])

  const handleTypeSelect = useCallback((ev) => {
    const colIndex = ev.currentTarget.dataset.colindex
    const type = ev.target.dataset.type

    cols[colIndex] = {
      ...cols[colIndex],
      type: type
    }

    setCols(cols.slice())
  })

  const handleColNameChange = useCallback((ev) => {

    let newVal = ev.currentTarget.value
    const colIndex = ev.currentTarget.dataset.colindex

    // revert spaces
    if (/\s/.test(newVal)){
      newVal = cols[colIndex].name
      toastr.warning('Column name cannot have spaces')
    }

    if (newVal.length && !(/^[a-zA-Z0-9][a-zA-Z0-9_]*$/.test(newVal))){
      newVal = cols[colIndex].name
      toastr.warning('Only alphanumeric characters and underscore allowed (cannot start with underscore)')
    }

    cols[colIndex] = {
      ...cols[colIndex],
      name: newVal
    }

    setCols(cols.slice())
  })

  const addColumn = useCallback(() => {

    cols.push({
      name: '',
      type: 'BYTES32',
      typeDropdownOpen: false
    })

    setCols(cols.slice())
  })

  const removeColumn = useCallback((ev) => {

    const colIndex = parseInt(ev.currentTarget.dataset.colindex)

    cols.splice(colIndex, 1)

    setCols(cols.slice())

  })

  const handleMove = useCallback((ev, dir) => {

    const colIndex = parseInt(ev.currentTarget.dataset.colindex)

    if (dir === DIRECTION.UP){
      if (colIndex === 0){
        return
      }

      // remove whatever is at the intended location
      setCols([
        ...cols.slice(0, colIndex - 1),
        cols[colIndex],
        cols[colIndex - 1],
        ...cols.slice(colIndex + 1)
      ])

    } else {
      // down
      if (colIndex >= cols.length - 1){
        return
      }

      setCols([
        ...cols.slice(0, colIndex),
        cols[colIndex + 1],
        cols[colIndex],
        ...cols.slice(colIndex + 2)
      ])
    }

  })

  const handleTableName = useCallback((ev) => {

    let newVal = ev.currentTarget.value

    if (/\s/.test(newVal)){
      toastr.warning('Table name cannot have spaces')
      newVal = tableName
    }

    if (newVal.length && !(/^[a-zA-Z0-9][a-zA-Z0-9_]*$/.test(newVal))){
      toastr.warning('Only alphanumeric characters and underscore allowed (cannot start with underscore)')
      newVal = tableName
    }

    setTableName(newVal)
  })


  /*
  ************************************************************************************************************
  * Create Table Call
  ************************************************************************************************************
   */
  const createTable = useCallback(() => {

    (async () => {

      console.log('createTable called')

      const numCols = cols.length

      if (!props.selectedDb || !props.selectedDb.contractAddress || !walletAddress){
        toastr.error('System Error - Missing contract address')
        return
      }

      if (tableName === ''){
        toastr.warning('Table name cannot be blank')
        return
      }

      // check that all cols have a name
      for (let i = 0; i < numCols; i++){
        if (cols[i].name === ''){
          toastr.warning('Table column names cannot be blank')
          return
        }
      }

      const colsRaw = _.map(cols, 'name')
      const typesRaw = _.map(cols, 'type')

      let colsHashed = colsRaw.map((colName) => Web3.utils.stringToHex(colName))
      let types = typesRaw.map((type) => Web3.utils.stringToHex(type))

      // set the database
      await ethConfig.elajsUser.defaultWeb3.currentProvider.baseProvider.enable()

      console.log('props.selectedDb.contractAddress', props.selectedDb.contractAddress)

      ethConfig.elajsUser.setDatabase(props.selectedDb.contractAddress)

      // only the owner can create the table
      await ethConfig.elajsUser.createTable(tableName, 2, colsHashed, types, walletAddress)

      toastr.success('Table created successfully')

      props.triggerEffect()

      props.closeModal()
    })()

  }, [tableName, cols, props.closeModal, props.selectedDb.contractAddress, ethConfig, walletAddress])

  return <div>

    <Container>

      <Row>
        <Col>
          <Card className="text-white bg-info">
            <CardBody>
              <h3>
                {ethBalance.toFixed(4)}
              </h3>

              <div>
                Your ELASC Balance
                <HelpIcon className="fa fa-question-circle fa-lg ml-1"/>

                <p className="mt-3">
                  You must have at least 0.01 ELASC to run the transaction
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="p-3">
          You will be prompted to sign and pay for the transaction.
        </Col>
      </Row>

      <Row>
        <Col>
          <InputGroup className="mb-3">
            <Input type="text" placeholder="table name" autoComplete="table name" onChange={handleTableName} value={tableName}/>
          </InputGroup>
        </Col>
      </Row>

      <button className="btn btn-secondary pull-right mb-1" onClick={addColumn}>Add Column</button>

      <ListGroup style={{clear: 'both'}}>
        {cols.map((col, i) => {
          return <InputGroup className="mb-1" key={i}>
            <InputGroupAddon addonType="prepend">
              <ColSortBox onClick={(ev) => handleMove(ev, DIRECTION.UP)} data-colindex={i}>
                <i className="cui-chevron-top icons"/>
              </ColSortBox>
            </InputGroupAddon>
            <Input type="text" placeholder="column name" autoComplete="column name" value={col.name} data-colindex={i} onChange={handleColNameChange}/>
            <TypeDropdown isOpen={col.typeDropdownOpen} toggle={() => {
              cols[i] = {
                ...cols[i],
                typeDropdownOpen: !col.typeDropdownOpen
              }
              setCols(cols.slice())
            }}>
              <DropdownToggle caret>
                {col.type}
              </DropdownToggle>
              <DropdownMenu onClick={handleTypeSelect} data-colindex={i}>
                <DropdownItem data-type="BYTES32">BYTES32</DropdownItem>
                <DropdownItem data-type="BOOL">BOOL</DropdownItem>
                <DropdownItem data-type="UINT">UINT</DropdownItem>
              </DropdownMenu>
            </TypeDropdown>
            <InputGroupAddon addonType="append">
              <ColSortBox onClick={(ev) => handleMove(ev, DIRECTION.DOWN)} data-colindex={i}>
                <i className="cui-chevron-bottom icons"/>
              </ColSortBox>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <ColTrashBox onClick={removeColumn} data-colindex={i}>
                <i className="cui-trash icons"/>
              </ColTrashBox>
            </InputGroupAddon>
          </InputGroup>
        })}
      </ListGroup>
    </Container>

    <hr/>

    <button className="btn btn-secondary pull-right mt-4" onClick={props.closeModal}>Cancel</button>
    <button className="btn btn-primary pull-right mt-4 mr-2" onClick={createTable}>Create</button>

    {pendingCreate ? <LoadingOverlay/> : <div></div>}
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(CreateTable)

const Container = styled.div`
  clear: both;
`

const ColSortBox = styled(InputGroupText)`
  cursor: pointer;
  
  :hover {
    background-color: rgb(47, 53, 58);
    color: #fff;
  }
`

const ColTrashBox = styled(InputGroupText)`
  cursor: pointer;
  
  :hover {
    background-color: #dc3545;
    color: #fff;
  }
`

const TypeDropdown = styled(Dropdown)`
  button.dropdown-toggle {
    text-align: right;
    min-width: 100px;
  }
`

const HelpIcon = styled.i`

  cursor: pointer;

  :hover {
    color: #ccc;
  }
`

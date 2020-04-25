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
import { toastr } from 'react-redux-toastr'
import styled from 'styled-components'
import { LoadingOverlay } from '../views/Pages/Loading'
import { useEthBalance } from '../hooks/useEthBalance'
import { EthContext } from '../context/EthContext'
import { connect } from 'react-redux'
import Web3 from 'web3'


const CreateDb = (props) => {

  const [dbName, setDbName] = useState('')

  const {ethBalance, walletAddress} = useEthBalance()

  const handleDbName = useCallback((ev) => {

    let newVal = ev.currentTarget.value

    if (/\s/.test(newVal)){
      toastr.warning('Column name cannot have spaces')
      newVal = dbName
    }

    setDbName(newVal)

  })

  /*
  ************************************************************************************************************
  * Create Database Call
  ************************************************************************************************************
   */
  const [ethConfig, ] = useContext(EthContext)

  const elajsDb = ethConfig.elajsDb
  const elajsDbUser = ethConfig.elajsDbUser

  const {ethAddress} = props.profile

  const [pendingCreate, setPendingCreate] = useState(false)

  const createDatabase = useCallback(() => {

    setPendingCreate(true)

    toastr.info('Please wait - this will take 10-15 seconds')

    ;(async () => {

      // await elajs.createTable(dbName, 3, colsHashed, types)
      const deployPromise = elajsDb.deployDatabase(ethAddress)

      let contractAddress = ''
      const userId = props.profile.userId

      deployPromise.on('transactionHash', (hash) => {
        toastr.info(`Transaction Sent: ${hash}`)
      })

      deployPromise.on('receipt', async (receipt) => {
        console.log('receipt', receipt)

        contractAddress = receipt.contractAddress

      })

      await deployPromise

      await elajsDbUser.defaultWeb3.currentProvider.baseProvider.enable()

      elajsDbUser.setDatabase(contractAddress)

      const initResult = await elajsDbUser.initializeContract(ethAddress)

      // console.log('initResult', initResult)

      await insertDatabaseRecord(dbName, contractAddress, userId)

      setPendingCreate(false)

      toastr.success(`Database "${dbName}" Created`)

      props.triggerEffect && props.triggerEffect()

      props.closeModal()

    })()
  }, [dbName, props.closeModal, ethConfig])

  const insertDatabaseRecord = async (dbName, contractAddress, userId) => {

    const cols = ['dbName', 'contractAddress', 'userId']
    const vals = [Web3.utils.stringToHex(dbName), contractAddress, userId]

    const id = Web3.utils.randomHex(32)

    for (let i = 0, len = cols.length; i < len; i++){
      let insertPromise = elajsDb.insertVal('database', cols[i], vals[i], {id})

      /*
      insertPromise.on('transactionHash', (hash) => {
        toastr.info(`Running transaction - ${hash} - (${i + 1} / ${len})`, {timeOut: 1500})
      })
      */

      insertPromise.on('receipt', () => {
        toastr.success(`Done - (${i + 1} / ${len})`, {timeOut: 1500})
      })

      await insertPromise
    }
  }

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
                  You must have at least 0.01 ELASC to deploy the smart contract
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="p-3">
          You will be prompted to sign and pay for the deployment transaction.
        </Col>
      </Row>

      <Row>
        <Col>
          <InputGroup className="mb-3">
            <Input type="text" placeholder="database name" autoComplete="database name" onChange={handleDbName} value={dbName}/>
          </InputGroup>
        </Col>
      </Row>

      {/*
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
      */}
    </Container>

    <hr/>

    <button className="btn btn-secondary pull-right mt-4" onClick={props.closeModal}>Cancel</button>
    <button className="btn btn-primary pull-right mt-4 mr-2" onClick={createDatabase}>Create</button>

    {pendingCreate ? <LoadingOverlay/> : <div></div>}
  </div>
}

const mapStateToProps = (state) => {
  return {
    profile: state.root.profile,
  }
}

export default connect(mapStateToProps)(CreateDb)

const Container = styled.div`
  clear: both;
`

const HelpIcon = styled.i`

  cursor: pointer;

  :hover {
    color: #ccc;
  }
`

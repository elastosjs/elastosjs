import React, { useState, useCallback } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ListGroup,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap'
import _ from 'lodash'
import { toastr } from 'react-redux-toastr'
import styled from 'styled-components'

export const CreateDb = (props) => {

  const [cols, setCols] = useState([
    {
      name: 'Test',
      type: 'BYTES32',
      typeDropdownOpen: false
    },
    {
      name: 'MyNumber',
      type: 'UINT',
      typeDropdownOpen: false
    },
    {
      name: 'Truthy',
      type: 'BOOL',
      typeDropdownOpen: false
    }
  ])

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

  return <div>

    <Container>
      <InputGroup className="mb-3">
        <Input type="text" placeholder="database name" autoComplete="database name" />
      </InputGroup>

      <button className="btn btn-secondary pull-right mb-1" onClick={addColumn}>Add Column</button>

      <ListGroup style={{clear: 'both'}}>
        {cols.map((col, i) => {
          return <InputGroup className="mb-1" key={i}>
            <InputGroupAddon addonType="prepend">
              <ColSortBox>
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
              <ColSortBox>
                <i className="cui-chevron-bottom icons"/>
              </ColSortBox>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <ColTrashBox>
                <i className="cui-trash icons"/>
              </ColTrashBox>
            </InputGroupAddon>
          </InputGroup>
        })}
      </ListGroup>

    </Container>

    <hr/>

    <button className="btn btn-secondary pull-right mt-4" onClick={props.closeModal}>Cancel</button>
    <button className="btn btn-primary pull-right mt-4 mr-2" onClick={props.closeModal}>Create</button>
  </div>
}

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

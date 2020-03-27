import React, { Component } from 'react'
import styled from 'styled-components'
import {HashLoader} from "react-spinners";


const StyledLoading = styled.div`
  padding-top: 30%;
  color: #fff;
`

const Loading = () => {

  return (
    <div className="App body" style={{'margin-top': '20%'}}>
      <div className="d-flex justify-content-center m-5">
        <HashLoader
          size={150}
          color={"#4f789c"}
          loading={true}
        />
      </div>
    </div>
  )
}

export default Loading

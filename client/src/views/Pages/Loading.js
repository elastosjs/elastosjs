import React, { Component } from 'react'
import styled from 'styled-components'
import {HashLoader} from "react-spinners";


const StyledLoading = styled.div`
  padding-top: 30%;
  color: #fff;
`

const Loading = () => {

  return (
    <div className="App body">
      <div className="d-flex justify-content-center m-5">
        <HashLoader
          size={150}
          color={"#ce60a5"}
          loading={true}
        />
      </div>
    </div>
  )
}

export default Loading

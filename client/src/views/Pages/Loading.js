import React from 'react'
import styled from 'styled-components'
import { HashLoader } from 'react-spinners'

const Loading = (props) => {

  const size = (props && props.size) || 150

  return (
    <div className="App body" style={{'marginTop': '20%'}}>
      <div className="d-flex justify-content-center m-5">
        <HashLoader
          size={size}
          color={"#4f789c"}
          loading={true}
        />
      </div>
    </div>
  )
}

export default Loading

const LoadingOverlay = () => {

  return <Overlay>
    <Loading/>
  </Overlay>

}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background-color: rgba(0, 0, 0, 0.4);
`

export { LoadingOverlay }
